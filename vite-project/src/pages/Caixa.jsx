import { useEffect, useState } from "react";
import api from "../services/api";

export default function Caixa() {
  const [saldo, setSaldo] = useState("");
  const [caixaAberto, setCaixaAberto] =
    useState(false);
  const [caixa, setCaixa] = useState(null);
  const [loading, setLoading] =
    useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  async function verificar() {
    try {
      const res = await api.get("/caixa");

      const caixaData =
        res.data?.caixa || res.data || null;

      setCaixa(caixaData);

      setCaixaAberto(
        caixaData?.status === "aberto"
      );

    } catch (err) {
      console.log(
        "ERRO CAIXA:",
        err.response?.data || err.message
      );

      if (
        err.response?.status === 401
      ) {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
  }

  useEffect(() => {
    verificar();

    const interval = setInterval(
      verificar,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  async function abrir() {
    try {
      if (!saldo) {
        return alert(
          "Informe o saldo inicial"
        );
      }

      setLoading(true);

      await api.post("/caixa/abrir", {
        abertoPor:
          user?.email || "Admin",
        saldoInicial:
          Number(saldo),
      });

      setSaldo("");
      await verificar();

      alert(
        "Caixa aberto com sucesso"
      );

    } catch (err) {
      alert(
        err.response?.data?.erro ||
          err.message
      );

    } finally {
      setLoading(false);
    }
  }

  async function fechar() {
    try {
      setLoading(true);

      await api.post("/caixa/fechar");

      await verificar();

      alert(
        "Caixa fechado com sucesso"
      );

    } catch (err) {
      alert(
        err.response?.data?.erro ||
          err.message
      );

    } finally {
      setLoading(false);
    }
  }

  const formatar = (valor) =>
    Number(valor || 0).toLocaleString(
      "pt-BR",
      {
        style: "currency",
        currency: "BRL",
      }
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        🧾 Caixa
      </h1>

      <div className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto">

        <p className="mb-2">
          Status:{" "}
          <span
            className={`font-bold ${
              caixaAberto
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {caixaAberto
              ? "Aberto"
              : "Fechado"}
          </span>
        </p>

        <p className="text-sm text-gray-500 mb-4">
          👤 {user?.email}
        </p>

        {!caixaAberto && (
          <input
            type="number"
            placeholder="Saldo inicial"
            value={saldo}
            onChange={(e) =>
              setSaldo(
                e.target.value
              )
            }
            className="border p-3 w-full rounded mb-4"
          />
        )}

        {!caixaAberto ? (
          <button
            onClick={abrir}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white w-full p-3 rounded-xl"
          >
            {loading
              ? "Abrindo..."
              : "Abrir Caixa"}
          </button>
        ) : (
          <button
            onClick={fechar}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white w-full p-3 rounded-xl"
          >
            {loading
              ? "Fechando..."
              : "Fechar Caixa"}
          </button>
        )}
      </div>

      {caixa && (
        <div className="bg-white p-6 mt-6 rounded-2xl shadow max-w-md mx-auto">

          <h2 className="font-bold mb-4">
            📊 Caixa Atual
          </h2>

          <div className="space-y-2">
            <p>
              Saldo Inicial:{" "}
              {formatar(
                caixa.saldoInicial
              )}
            </p>

            <p>
              Entradas:{" "}
              {formatar(
                caixa.entradas
              )}
            </p>

            <p>
              Saídas:{" "}
              {formatar(
                caixa.saidas
              )}
            </p>

            <p>
              Total Vendas:{" "}
              {formatar(
                caixa.totalVendas
              )}
            </p>

            <p>
              Lucro:{" "}
              {formatar(
                caixa.lucro
              )}
            </p>
          </div>

          <hr className="my-4" />

          <p className="font-bold text-lg text-blue-600">
            Saldo Atual:{" "}
            {formatar(
              caixa.saldoAtual
            )}
          </p>

        </div>
      )}
    </div>
  );
}