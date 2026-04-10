import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [produtos, setProdutos] = useState(() => {
    const data = JSON.parse(localStorage.getItem("dados"));
    return data?.produtos || [];
  });

  const [movimentos, setMovimentos] = useState(() => {
    const data = JSON.parse(localStorage.getItem("dados"));
    return data?.movimentos || [];
  });

  const [nome, setNome] = useState("");
  const [estoque, setEstoque] = useState("");
  const [preco, setPreco] = useState("");

  const [editando, setEditando] = useState(null);

  const [vendaId, setVendaId] = useState("");
  const [quantidade, setQuantidade] = useState("");

  useEffect(() => {
    localStorage.setItem("dados", JSON.stringify({ produtos, movimentos }));
  }, [produtos, movimentos]);

  function cadastrarProduto() {
    if (!nome || !estoque || !preco) return;

    if (editando) {
      setProdutos(produtos.map(p => p.id === editando ? {
        ...p,
        nome,
        estoque: Number(estoque),
        preco: Number(preco)
      } : p));

      setEditando(null);
    } else {
      const novo = {
        id: Date.now(),
        nome,
        estoque: Number(estoque),
        preco: Number(preco)
      };

      setProdutos([...produtos, novo]);
    }

    setNome("");
    setEstoque("");
    setPreco("");
  }

  function editarProduto(p) {
    setNome(p.nome);
    setEstoque(p.estoque);
    setPreco(p.preco);
    setEditando(p.id);
  }

  function excluirProduto(id) {
    setProdutos(produtos.filter(p => p.id !== id));
  }

  function vender() {
    const produto = produtos.find(p => p.id == vendaId);
    const qtd = Number(quantidade);

    if (!produto || produto.estoque < qtd) {
      alert("Estoque insuficiente");
      return;
    }

    produto.estoque -= qtd;

    const total = produto.preco * qtd;

    setMovimentos([
      ...movimentos,
      {
        tipo: "entrada",
        valor: total,
        data: new Date().toISOString()
      }
    ]);

    setProdutos([...produtos]);
    setQuantidade("");
  }

  const saldo = movimentos.reduce((acc, m) => m.tipo === "entrada" ? acc + m.valor : acc - m.valor, 0);

  // 📊 AGRUPAR POR MÊS
  const relatorio = {};

  movimentos.forEach(m => {
    const mes = new Date(m.data).toLocaleString("pt-BR", { month: "short" });

    if (!relatorio[mes]) relatorio[mes] = 0;
    relatorio[mes] += m.valor;
  });

  const dadosGrafico = Object.keys(relatorio).map(mes => ({
    mes,
    valor: relatorio[mes]
  }));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sistema Loja</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2>Saldo: R$ {saldo.toFixed(2)}</h2>
      </div>

      {/* CADASTRO */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2>{editando ? "Editar" : "Cadastrar"} Produto</h2>

        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" className="border p-2 mr-2" />
        <input value={estoque} onChange={e => setEstoque(e.target.value)} type="number" placeholder="Estoque" className="border p-2 mr-2" />
        <input value={preco} onChange={e => setPreco(e.target.value)} type="number" placeholder="Preço" className="border p-2 mr-2" />

        <button onClick={cadastrarProduto} className="bg-blue-500 text-white p-2">
          {editando ? "Salvar" : "Cadastrar"}
        </button>
      </div>

      {/* PRODUTOS */}
      <div className="bg-white p-4 rounded shadow mb-6">
        {produtos.map(p => (
          <div key={p.id} className="flex justify-between border-b py-2">
            <span>{p.nome}</span>
            <span>{p.estoque}</span>
            <span>R$ {p.preco}</span>

            <div className="flex gap-2">
              <button onClick={() => editarProduto(p)} className="bg-yellow-400 px-2">✏️</button>
              <button onClick={() => excluirProduto(p.id)} className="bg-red-500 text-white px-2">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* VENDA */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <select value={vendaId} onChange={e => setVendaId(e.target.value)} className="border p-2 mr-2">
          <option value="">Produto</option>
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <input value={quantidade} onChange={e => setQuantidade(e.target.value)} type="number" placeholder="Qtd" className="border p-2 mr-2" />

        <button onClick={vender} className="bg-green-500 text-white p-2">Vender</button>
      </div>

      {/* GRÁFICO */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2>Vendas por mês</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* RELATÓRIO */}
      <div className="bg-white p-4 rounded shadow">
        <h2>Relatório Mensal</h2>

        {Object.keys(relatorio).map(mes => (
          <p key={mes}>{mes}: R$ {relatorio[mes].toFixed(2)}</p>
        ))}
      </div>
    </div>
  );
}
