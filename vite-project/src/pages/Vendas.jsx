import { useEffect, useState } from "react";
import axios from "axios";

export default function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [produtoId, setProdutoId] = useState("");
  const [cliente, setCliente] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const API = "https://fluxo-caixa-back.onrender.com";

  // 🔥 carregar dados
  useEffect(() => {
    async function carregar() {
      try {
        const resProd = await axios.get(`${API}/produtos`);
        const resCli = await axios.get(`${API}/clientes`);

        setProdutos(resProd.data || []);
        setClientes(resCli.data || []);
      } catch (err) {
        console.log("Erro ao carregar:", err);
      }
    }

    carregar();
  }, []);

  // 🔎 produto selecionado
  const produtoSelecionado =
    produtos.find((p) => p._id === produtoId) || null;

  // 💰 total
  const total =
    produtoSelecionado && quantidade
      ? (produtoSelecionado.preco || 0) * Number(quantidade)
      : 0;

  // 🧾 gerar recibo
  function gerarRecibo(venda) {
    const win = window.open("", "_blank");

    win.document.write(`
      <html>
        <head>
          <title>Recibo</title>
          <style>
            body {
              font-family: Arial;
              text-align: center;
              padding: 20px;
            }
            h2 {
              margin-bottom: 20px;
            }
            .linha {
              margin: 10px 0;
            }
          </style>
        </head>
        <body>

          <h2>🧾 MK IMPORTS</h2>

          <div class="linha">Cliente: ${venda.cliente || "Balcão"}</div>
          <div class="linha">Produto: ${venda.produto}</div>
          <div class="linha">Quantidade: ${venda.quantidade}</div>

          <hr/>

          <div class="linha"><strong>Total: R$ ${venda.valor}</strong></div>

          <p>Obrigado pela preferência 🙏</p>

          <script>
            window.print();
          </script>

        </body>
      </html>
    `);
  }

  // 🛒 vender
  async function vender() {
    try {
      if (!produtoId || !quantidade) {
        alert("Preencha os dados");
        return;
      }

      const res = await axios.post(`${API}/venda`, {
        produtoId,
        qtd: Number(quantidade),
        cliente,
        vendedor: "Caixa"
      });

      const venda = res.data;

      // 🔊 som de venda
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
      audio.play();

      alert("Venda realizada 🔥");

      // 🧾 recibo automático
      gerarRecibo(venda);

      setProdutoId("");
      setCliente("");
      setQuantidade("");
    } catch (err) {
      console.log(err);
      alert("Erro na venda");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        🛒 Nova Venda
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-2xl">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* PRODUTO */}
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Selecione o produto</option>
            {produtos.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome}
              </option>
            ))}
          </select>

          {/* CLIENTE */}
          <select
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">Cliente (opcional)</option>
            {clientes.map((c) => (
              <option key={c._id} value={c.nome}>
                {c.nome}
              </option>
            ))}
          </select>

          {/* QUANTIDADE */}
          <input
            type="number"
            placeholder="Quantidade"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="border p-3 rounded md:col-span-2"
          />

        </div>

        {/* INFO PRODUTO */}
        {produtoSelecionado && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p>Preço: R$ {produtoSelecionado.preco}</p>
            <p>Estoque: {produtoSelecionado.estoque}</p>
          </div>
        )}

        {/* TOTAL */}
        {total > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded text-green-700 font-bold">
            Total: R$ {total.toFixed(2)}
          </div>
        )}

        {/* BOTÃO */}
        <button
          onClick={vender}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white p-4 rounded-xl text-lg font-bold transition active:scale-95"
        >
          💰 Finalizar Venda
        </button>

      </div>

    </div>
  );
}