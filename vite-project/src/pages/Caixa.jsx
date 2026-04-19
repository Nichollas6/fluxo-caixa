import { useEffect, useState } from "react";
import api from "../services/api";

export default function Caixa() {
  const [saldo, setSaldo] = useState("");
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 verificar caixa + resumo
  async function verificar() {
    try {
      const res = await api.get("/caixa");

      if (res.data) {
        setCaixaAberto(true);

        try {
          const resumo = await api.get("/caixa/resumo");
          setRelatorio(resumo.data);
        } catch (err) {
          console.log("Erro resumo:", err);
        }

      } else {
        setCaixaAberto(false);
        setRelatorio(null);
      }

    } catch (err) {
      console.log("Erro caixa:", err);
    }
  }

  // 🔄 auto update
  useEffect(() => {
    verificar();

    const intervalo = setInterval(verificar, 5000);

    return () => clearInterval(intervalo);
  }, []);

  // 🟢 abrir
  async function abrir() {
    try {
      if (!saldo) {
        alert("Informe o saldo inicial");
        return;
      }

      setLoading(true);

      await api.post("/caixa/abrir", {
        usuario: user?.email,
        valor: Number(saldo)
      });

      setSaldo("");
      await verificar();

    } catch (err) {
      alert(err.response?.data || "Erro ao abrir caixa");
    } finally {
      setLoading(false);
    }
  }

  // 🔴 fechar
  async function fechar() {
    try {
      setLoading(true);

      const res = await api.post("/caixa/fechar");

      setRelatorio(res.data);
      setCaixaAberto(false);

    } catch (err) {
      alert(err.response?.data || "Erro ao fechar caixa");
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
          👤 {user?.email}
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
            className="bg-green-500 text-white w-full p-2"
          >
            {loading ? "Abrindo..." : "Abrir Caixa"}
          </button>
        ) : (
          <button
            onClick={fechar}
            disabled={loading}
            className="bg-red-500 text-white w-full p-2"
          >
            {loading ? "Fechando..." : "Fechar Caixa"}
          </button>
        )}

      </div>

      {/* 📊 RELATÓRIO */}
      {relatorio && (
        <div className="bg-white p-6 mt-6 rounded shadow max-w-md">

          <h2 className="font-bold mb-3">📊 Resumo</h2>

          <p>Entradas: R$ {relatorio.totalVendas}</p>
          <p>Lucro: R$ {relatorio.lucro}</p>
          <p>Vendas: {relatorio.quantidade}</p>

          {relatorio.saldoAtual && (
            <>
              <hr className="my-2" />
              <p className="font-bold">
                Saldo atual: R$ {relatorio.saldoAtual}
              </p>
            </>
          )}

        </div>
      )}

    </div>
  );
}