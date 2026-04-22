import { useEffect, useState } from "react";
import api from "../services/api";

export default function Caixa() {
  const [saldo, setSaldo] = useState("");
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [caixa, setCaixa] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // 🔍 verificar caixa
 async function verificar() {
  try {
    const res = await api.get("/caixa");

    const caixaData = res.data?.caixa;

    setCaixa(caixaData || null);
    setCaixaAberto(!!caixaData); // 🔥 simplificado e seguro

  } catch (err) {
    console.log("ERRO:", err.response?.data || err.message);
  }
}

  useEffect(() => {
  verificar();

  const interval = setInterval(() => {
    verificar();
  }, 3000); // 🔥 atualiza a cada 3s

  return () => clearInterval(interval);
}, []);

  // 🟢 abrir caixa
  async function abrir() {
    try {
      if (!saldo) return alert("Informe o saldo inicial");

      setLoading(true);

      await api.post("/caixa/abrir", {
        abertoPor: user?.email,
        saldoInicial: Number(saldo),
      });

      setSaldo("");
      await verificar(); // ✔ ATUALIZA ESTADO

    } catch (err) {
      alert(err.response?.data?.erro || err.message);

    } finally {
      setLoading(false);
    }
  }

  // 🔴 fechar caixa
  async function fechar() {
    try {
      setLoading(true);

      const res = await api.post("/caixa/fechar");

      setCaixaAberto(false);
      setCaixa(null);

      // ✔ atualiza estado depois de fechar
      await verificar();

    } catch (err) {
      alert(err.response?.data?.erro || err.message);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-2xl font-bold mb-6">🧾 Caixa</h1>

      <div className="bg-white p-6 rounded shadow max-w-md">

        <p>
          Status:{" "}
          <span className={caixaAberto ? "text-green-600" : "text-red-600"}>
            {caixaAberto ? "Aberto" : "Fechado"}
          </span>
        </p>

        <p className="text-sm text-gray-500 mb-3">
          👤 {user?.email || "Usuário não identificado"}
        </p>

        <input
          type="number"
          placeholder="Saldo inicial"
          value={saldo}
          onChange={(e) => setSaldo(e.target.value)}
          className="border p-2 w-full mb-3"
        />

        {!caixaAberto ? (
          <button
            onClick={abrir}
            disabled={loading}
            className="bg-green-500 text-white w-full p-2 rounded"
          >
            {loading ? "Abrindo..." : "Abrir Caixa"}
          </button>
        ) : (
          <button
            onClick={fechar}
            disabled={loading}
            className="bg-red-500 text-white w-full p-2 rounded"
          >
            {loading ? "Fechando..." : "Fechar Caixa"}
          </button>
        )}
      </div>

      {/* 📊 CAIXA REAL */}
      {caixa && (
        <div className="bg-white p-6 mt-6 rounded shadow max-w-md">

          <h2 className="font-bold mb-3">📊 Caixa Atual</h2>

          <p>Saldo inicial: R$ {caixa.saldoInicial}</p>
          <p>Entradas: R$ {caixa.entradas}</p>
          <p>Saídas: R$ {caixa.saidas}</p>
          <p>Total vendas: R$ {caixa.totalVendas}</p>
          <p>Lucro: R$ {caixa.lucro}</p>

          <hr className="my-2" />

          <p className="font-bold">
            Saldo atual: R$ {caixa.saldoAtual}
          </p>

        </div>
      )}

    </div>
  );
}