import { useState, useEffect } from "react";
import axios from "axios";

export default function Financeiro() {
  const [contas, setContas] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");

  const API = "https://fluxo-caixa-back.onrender.com";

  useEffect(() => {
    carregar();
  }, []);

  function getConfig() {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  async function carregar() {
    try {
      const res = await axios.get(
        `${API}/contas`,
        getConfig()
      );

      setContas(res.data);

    } catch (err) {
      console.log("ERRO AO CARREGAR CONTAS:", err.response?.data || err);
    }
  }

  async function salvar() {
    try {
      if (!descricao.trim()) {
        return alert("Digite uma descrição");
      }

      if (!valor || Number(valor) <= 0) {
        return alert("Digite um valor válido");
      }

      await axios.post(
        `${API}/contas`,
        {
          descricao: descricao.trim(),
          valor: Number(valor)
        },
        getConfig()
      );

      alert("Conta adicionada com sucesso");

      setDescricao("");
      setValor("");

      carregar();

    } catch (err) {
      console.log("ERRO AO SALVAR:", err.response?.data || err);

      alert(
        err.response?.data?.erro ||
        "Erro ao adicionar conta"
      );
    }
  }

  async function pagar(id) {
    try {
      await axios.put(
        `${API}/contas/${id}`,
        {},
        getConfig()
      );

      alert("Conta paga com sucesso");

      carregar();

    } catch (err) {
      console.log("ERRO AO PAGAR:", err.response?.data || err);

      alert(
        err.response?.data?.erro ||
        "Erro ao pagar conta"
      );
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          💰 Financeiro
        </h1>

        {/* FORM */}
        <div className="bg-white p-4 rounded-2xl shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            <input
              className="border p-3 rounded-xl"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />

            <input
              className="border p-3 rounded-xl"
              placeholder="Valor"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
            />

            <button
              onClick={salvar}
              className="bg-blue-600 text-white rounded-xl"
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
                <p className="font-semibold">
                  {c.descricao}
                </p>

                <p>
                  R$ {Number(c.valor).toFixed(2)}
                </p>
              </div>

              {!c.pago ? (
                <button
                  onClick={() => pagar(c._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl"
                >
                  Pagar
                </button>
              ) : (
                <span className="text-green-600 font-bold">
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