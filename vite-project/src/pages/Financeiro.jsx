import { useState, useEffect } from "react";
import axios from "axios";

export default function Financeiro() {
  const [contas, setContas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const API = "http://localhost:3000";

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    const res = await axios.get(`${API}/contas`);
    setContas(res.data);
  }

  async function salvar() {
    if (!descricao || !valor) return;

    await axios.post(`${API}/contas`, {
      descricao,
      valor
    });

    setDescricao("");
    setValor("");
    carregar();
  }

  async function pagar(id) {
    await axios.put(`${API}/contas/${id}`);
    carregar();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          💰 Financeiro
        </h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Descrição"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />

            <input
              className="border p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Valor"
              value={valor}
              onChange={e => setValor(e.target.value)}
            />

            <button
              onClick={salvar}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* LISTA */}
        <div className="space-y-3">
          {contas.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-2xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {c.descricao}
                </p>
                <p className="text-gray-500">
                  R$ {Number(c.valor).toFixed(2)}
                </p>
              </div>

              {!c.pago ? (
                <button
                  onClick={() => pagar(c._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl transition"
                >
                  Pagar
                </button>
              ) : (
                <span className="text-green-600 font-semibold">
                  Pago ✔
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}