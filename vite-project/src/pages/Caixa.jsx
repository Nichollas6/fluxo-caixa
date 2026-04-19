import { useEffect, useState } from "react";
import api from "../services/api";

export default function Caixa() {
  const [saldo, setSaldo] = useState("");
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [relatorio, setRelatorio] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 função segura para evitar [object Object]
  function format(valor) {
    if (valor == null) return 0;

    if (typeof valor === "object") {
      return valor.valor ?? valor.total ?? valor.soma ?? 0;
    }

    return Number(valor) || 0;
  }

  // 🔥 verificar caixa
  async function verificar() {
    try {
      const res = await api.get("/caixa");

      if (res.data) {
        setCaixaAberto(true);
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

  // 🟢 abrir caixa
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

  // 🔴 fechar caixa
  async function fechar() {
    try {
      setLoading(true);

      const res = await api.post("/caixa/fechar");

      setRelatorio(res.data); // 👈 backend já retorna aqui
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

          <p>Entradas: R$ {format(relatorio.totalVendas)}</p>
          <p>Lucro: R$ {format(relatorio.lucro)}</p>
          <p>Vendas: {format(relatorio.quantidade)}</p>

          {relatorio.caixa?.saldoFinal !== undefined && (
            <>
              <hr className="my-2" />
              <p className="font-bold">
                Saldo final: R$ {format(relatorio.caixa.saldoFinal)}
              </p>
            </>
          )}

        </div>
      )}

    </div>
  );
}