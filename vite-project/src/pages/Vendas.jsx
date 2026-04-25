import { useEffect, useState } from "react";
import axios from "axios";

export default function Vendas() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);

  const [produtoId, setProdutoId] = useState("");
  const [cliente, setCliente] = useState("");
  const [quantidade, setQuantidade] = useState("");

  const API = "https://fluxo-caixa-back.onrender.com";

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const resProd = await axios.get(
        `${API}/produtos`,
        config
      );

      const resCli = await axios.get(
        `${API}/clientes`,
        config
      );

      setProdutos(resProd.data || []);
      setClientes(resCli.data || []);

    } catch (err) {
      console.log("ERRO AO CARREGAR:", err);
    }
  }

  const produtoSelecionado =
    produtos.find((p) => p._id === produtoId) || null;

  const total =
    produtoSelecionado && quantidade
      ? produtoSelecionado.preco * Number(quantidade)
      : 0;

  function gerarRecibo(venda) {
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
      <head>
        <title>Recibo</title>
      </head>

      <body style="font-family:Arial;text-align:center;padding:20px;">

        <h2>MK IMPORTS</h2>

        <p>Cliente: ${venda.cliente || "Balcão"}</p>
        <p>Produto: ${venda.produto}</p>
        <p>Quantidade: ${venda.quantidade}</p>

        <hr/>

        <h3>Total: R$ ${Number(venda.valor).toFixed(2)}</h3>

        <p>Obrigado pela preferência 🙏</p>

        <script>
          window.print();
        </script>

      </body>
    </html>
  `);

  win.document.close();
}

  async function vender() {
    try {
      if (!produtoId) {
        return alert("Selecione um produto");
      }

      if (!quantidade || Number(quantidade) <= 0) {
        return alert("Quantidade inválida");
      }

      if (
        produtoSelecionado &&
        Number(quantidade) > produtoSelecionado.estoque
      ) {
        return alert("Estoque insuficiente");
      }

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.post(`${API}/vendas`, {
          produtoId,
          qtd: Number(quantidade),
          cliente,
          vendedor: "Caixa"
        },
        config
      );

      const venda = res.data;

      const audio = new Audio(
        "https://www.soundjay.com/buttons/sounds/button-3.mp3"
      );

      audio.play();

      alert("Venda realizada com sucesso");

      gerarRecibo(venda);

      setProdutoId("");
      setCliente("");
      setQuantidade("");

      carregar();

    } catch (err) {
      console.log("ERRO VENDA:", err.response?.data || err);

      alert(
        err.response?.data?.erro ||
        "Erro ao realizar venda"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <h1 className="text-3xl font-bold mb-6">
        🛒 Nova Venda
      </h1>

      <div className="bg-white p-6 rounded shadow max-w-2xl">

        <div className="grid md:grid-cols-2 gap-4">

          {/* PRODUTOS */}
          <select
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">
              Selecione o produto
            </option>

            {produtos.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nome}
              </option>
            ))}
          </select>

          {/* CLIENTES */}
          <select
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="">
              Cliente (opcional)
            </option>

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
            onChange={(e) =>
              setQuantidade(e.target.value)
            }
            className="border p-3 rounded md:col-span-2"
          />

        </div>

        {/* INFO PRODUTO */}
        {produtoSelecionado && (
          <div className="mt-4 bg-gray-50 p-4 rounded">
            <p>
              Preço: R$ {produtoSelecionado.preco}
            </p>

            <p>
              Estoque: {produtoSelecionado.estoque}
            </p>
          </div>
        )}

        {/* TOTAL */}
        {total > 0 && (
          <div className="mt-4 bg-green-100 p-4 rounded font-bold text-green-700">
            Total: R$ {total.toFixed(2)}
          </div>
        )}

        <button
          onClick={vender}
          className="w-full mt-6 bg-green-500 text-white p-4 rounded font-bold hover:bg-green-600"
        >
          💰 Finalizar Venda
        </button>

      </div>
    </div>
  );
}