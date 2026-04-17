import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroBaixo, setFiltroBaixo] = useState(false);

  const [editando, setEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [custo, setCusto] = useState("");
  const [estoque, setEstoque] = useState("");

  const API = "https://fluxo-caixa-back.onrender.com";

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await axios.get(`${API}/produtos`);
      setProdutos(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  // 🔥 FUNÇÃO CORRIGIDA
  async function salvar() {
    console.log("CLICOU SALVAR 🔥");

    try {
      if (!nome) {
        alert("Preencha o nome");
        return;
      }

      if (editando) {
        // ✏️ EDITAR
        await axios.put(`${API}/produtos/${editando}`, {
          nome,
          preco: Number(preco),
          custo: Number(custo),
          estoque: Number(estoque)
        });

        alert("Produto atualizado 🔥");

      } else {
        // ➕ NOVO
        await axios.post(`${API}/produtos`, {
          nome,
          preco: Number(preco),
          custo: Number(custo),
          estoque: Number(estoque)
        });

        alert("Produto criado 🔥");
      }

      limpar();
      carregar();

    } catch (err) {
      console.log("ERRO:", err);
      alert("Erro ao salvar");
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir produto?")) return;

    await axios.delete(`${API}/produtos/${id}`);
    carregar();
  }

  function editar(p) {
    setEditando(p._id);
    setNome(p.nome);
    setPreco(p.preco);
    setCusto(p.custo);
    setEstoque(p.estoque);
  }

  function limpar() {
    setEditando(null);
    setNome("");
    setPreco("");
    setCusto("");
    setEstoque("");
  }

  // 🔎 FILTROS
  const lista = produtos
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter(p => (filtroBaixo ? p.estoque < 5 : true));

  // 📊 gráfico
  const dadosGrafico = produtos.map(p => ({
    nome: p.nome,
    estoque: p.estoque
  }));

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">📦 Produtos</h1>

      {/* BUSCA */}
      <input
        placeholder="Buscar produto..."
        onChange={(e) => setBusca(e.target.value)}
        className="border p-3 rounded mb-4 w-full"
      />

      {/* FILTRO */}
      <label className="block mb-4">
        <input
          type="checkbox"
          onChange={(e) => setFiltroBaixo(e.target.checked)}
        />{" "}
        Mostrar estoque baixo
      </label>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="mb-4 font-bold">
          {editando ? "Editar Produto" : "Novo Produto"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="border p-2"
          />

          <input
            placeholder="Preço"
            type="number"
            value={preco}
            onChange={e => setPreco(e.target.value)}
            className="border p-2"
          />

          <input
            placeholder="Custo"
            type="number"
            value={custo}
            onChange={e => setCusto(e.target.value)}
            className="border p-2"
          />

          <input
            placeholder="Estoque"
            type="number"
            value={estoque}
            onChange={e => setEstoque(e.target.value)}
            className="border p-2"
          />

        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={salvar}
            className="bg-blue-500 text-white p-2 rounded"
          >
            💾 Salvar
          </button>

          {editando && (
            <button
              onClick={limpar}
              className="bg-gray-400 text-white p-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>

      </div>

      {/* GRÁFICO */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="mb-4 font-bold">📊 Estoque</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dadosGrafico}>
            <XAxis dataKey="nome" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="estoque" />
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* LISTA */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {lista.map(p => (
          <div key={p._id} className="bg-white p-4 rounded shadow">

            <h2 className="font-bold">{p.nome}</h2>
            <p>💰 R$ {p.preco}</p>
            <p>📦 Estoque: {p.estoque}</p>

            {p.estoque < 5 && (
              <p className="text-red-500 font-bold">⚠️ Baixo</p>
            )}

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => editar(p)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                ✏️
              </button>

              <button
                onClick={() => excluir(p._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                🗑
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}