import { useEffect, useState } from "react";
import axios from "axios";

export default function Caixa() {
  const [saldo, setSaldo] = useState("");
  const [relatorio, setRelatorio] = useState(null);
  const [caixaAberto, setCaixaAberto] = useState(false);

  // 🔥 BACKEND ONLINE
  const API = "https://fluxo-caixa-back.onrender.com";

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔍 verificar caixa ao carregar
  useEffect(() => {
    async function verificar() {
      try {
        const res = await axios.get(`${API}/caixa`);
        if (res.data) {
          setCaixaAberto(true);
        }
      } catch (err) {
        console.log("Erro ao verificar caixa:", err);
      }
    }

    verificar();
  }, []);

  // 🟢 abrir caixa
  async function abrir() {
    try {
      if (!saldo) {
        alert("Informe o saldo inicial");
        return;
      }

      await axios.post(`${API}/caixa/abrir`, {
        usuario: user?.email,
        valor: Number(saldo)
      });

      alert("Caixa aberto 🔥");
      setCaixaAberto(true);

    } catch (err) {
      console.log("Erro abrir caixa:", err.response?.data);
      alert("Erro ao abrir caixa");
    }
  }

  // 🔴 fechar caixa
  async function fechar() {
    try {
      const res = await axios.post(`${API}/caixa/fechar`);

      setRelatorio(res.data);
      setCaixaAberto(false);

      alert("Caixa fechado 🔥");

    } catch (err) {
      console.log("Erro fechar caixa:", err.response?.data);
      alert("Erro ao fechar caixa");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6">🧾 Caixa</h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-md">

        {/* STATUS */}
        <p className="mb-4">
          Status:{" "}
          <span className={caixaAberto ? "text-green-600" : "text-red-600"}>
            {caixaAberto ? "Aberto" : "Fechado"}
          </span>
        </p>

        {/* USUÁRIO */}
        <p className="mb-4 text-sm text-gray-500">
          👤 {user?.email}
        </p>

        {/* INPUT */}
        <input
          type="number"
          placeholder="Saldo inicial"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />

        {/* BOTÕES */}
        {!caixaAberto ? (
          <button
            onClick={abrir}
            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
          >
            Abrir Caixa
          </button>
        ) : (
          <button
            onClick={fechar}
            className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
          >
            Fechar Caixa
          </button>
        )}

      </div>

      {/* 📊 RELATÓRIO */}
      {relatorio && (
        <div className="bg-white p-6 rounded-2xl shadow mt-6 max-w-md">

          <h2 className="font-bold mb-4">📊 Relatório do Caixa</h2>

          <p>Total vendas: R$ {relatorio.totalVendas}</p>
          <p>Lucro: R$ {relatorio.lucro}</p>
          <p>Quantidade de vendas: {relatorio.quantidade}</p>

          <hr className="my-3" />

          <p className="font-bold">
            Saldo final: R$ {relatorio.caixa?.saldoFinal}
          </p>

        </div>
      )}

    </div>
  );
}