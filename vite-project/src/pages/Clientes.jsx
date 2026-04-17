import { useState, useEffect } from "react";
import axios from "axios";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  const [historico, setHistorico] = useState([]);

  // 🔥 BACKEND ONLINE
  const API = "https://fluxo-caixa-back.onrender.com";

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await axios.get(`${API}/clientes`);
      setClientes(res.data);
    } catch (err) {
      console.log("Erro ao carregar clientes:", err);
    }
  }

  async function salvar() {
    console.log("CLICOU SALVAR CLIENTE 🔥");

    try {
      if (!nome.trim()) {
        alert("Digite o nome do cliente");
        return;
      }

      if (editando) {
        await axios.put(`${API}/clientes/${editando}`, {
          nome: nome.trim(),
          telefone: telefone.trim()
        });

        alert("Cliente atualizado 🔥");

      } else {
        await axios.post(`${API}/clientes`, {
          nome: nome.trim(),
          telefone: telefone.trim()
        });

        alert("Cliente criado 🔥");
      }

      limpar();
      carregar();

    } catch (err) {
      console.log("ERRO CLIENTE:", err.response?.data);
      alert("Erro ao salvar cliente");
    }
  }

  async function excluir(id) {
    if (!confirm("Excluir cliente?")) return;

    try {
      await axios.delete(`${API}/clientes/${id}`);
      carregar();
    } catch (err) {
      console.log("Erro ao excluir:", err);
    }
  }

  function editar(c) {
    setEditando(c._id);
    setNome(c.nome);
    setTelefone(c.telefone);
  }

  function limpar() {
    setEditando(null);
    setNome("");
    setTelefone("");
  }

  // 📋 histórico
  async function verHistorico(nomeCliente) {
    try {
      const res = await axios.get(`${API}/venda`);
      const lista = res.data.filter(v => v.cliente === nomeCliente);
      setHistorico(lista);
    } catch (err) {
      console.log("Erro histórico:", err);
    }
  }

  // 🔎 busca
  const lista = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">👤 Clientes</h1>

      {/* BUSCA */}
      <input
        placeholder="Buscar cliente..."
        onChange={(e) => setBusca(e.target.value)}
        className="border p-3 rounded mb-4 w-full"
      />

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6">

        <h2 className="mb-4 font-bold">
          {editando ? "Editar Cliente" : "Novo Cliente"}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Nome"
            value={nome}
            onChange={e => setNome(e.target.value)}
            className="border p-2"
          />

          <input
            placeholder="Telefone"
            value={telefone}
            onChange={e => setTelefone(e.target.value)}
            className="border p-2"
          />

        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={salvar} className="bg-blue-500 text-white p-2 rounded">
            💾 Salvar
          </button>

          {editando && (
            <button onClick={limpar} className="bg-gray-400 text-white p-2 rounded">
              Cancelar
            </button>
          )}
        </div>

      </div>

      {/* LISTA */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {lista.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow">

            <h2 className="font-bold">{c.nome}</h2>
            <p>📞 {c.telefone}</p>

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => editar(c)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                ✏️
              </button>

              <button
                onClick={() => excluir(c._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                🗑
              </button>

              <button
                onClick={() => verHistorico(c.nome)}
                className="bg-green-500 text-white p-2 rounded"
              >
                📋
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* HISTÓRICO */}
      {historico.length > 0 && (
        <div className="bg-white p-6 mt-6 rounded shadow">

          <h2 className="font-bold mb-4">📋 Histórico</h2>

          {historico.map((v, i) => (
            <div key={i} className="border-b py-2">
              {v.produto} - {v.quantidade} - R$ {v.valor}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}