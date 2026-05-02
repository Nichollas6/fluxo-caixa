import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [dados, setDados] = useState([]);
  const [mes, setMes] = useState("");
  const [loading, setLoading] = useState(true);

  const API = "https://fluxo-caixa-back.onrender.com";

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    carregar();

    const intervalo = setInterval(() => {
      carregar();
    }, 5000);

    return () => clearInterval(intervalo);
  }, [mes]);

  async function carregar() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API}/dashboard?mes=${mes}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDados(res.data || []);
    } catch (err) {
      console.log("Erro dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  const totalEntrada = dados.reduce(
    (acc, item) => acc + (item.entrada || 0),
    0
  );

  const totalSaida = dados.reduce(
    (acc, item) => acc + (item.saida || 0),
    0
  );

  const lucro = totalEntrada - totalSaida;

  const formatar = (valor) =>
    Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-100 p-3 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

        <h1 className="text-2xl md:text-3xl font-bold">
          📊 Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center w-full md:w-auto">

          <span className="text-sm md:text-base bg-white px-3 py-2 rounded-xl shadow text-center">
            👤 {user?.email}
          </span>

          <select
            className="border p-2 rounded-xl bg-white shadow w-full sm:w-auto"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
            <option value="6">Junho</option>
            <option value="7">Julho</option>
            <option value="8">Agosto</option>
            <option value="9">Setembro</option>
            <option value="10">Outubro</option>
            <option value="11">Novembro</option>
            <option value="12">Dezembro</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="mb-4 text-gray-500 text-sm md:text-base">
          Carregando dados...
        </p>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded-2xl shadow w-full">
          <p className="text-gray-500 text-sm">
            Entradas
          </p>

          <h2 className="text-green-600 text-xl md:text-2xl font-bold break-words">
            {formatar(totalEntrada)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow w-full">
          <p className="text-gray-500 text-sm">
            Saídas
          </p>

          <h2 className="text-red-500 text-xl md:text-2xl font-bold break-words">
            {formatar(totalSaida)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow w-full">
          <p className="text-gray-500 text-sm">
            Lucro
          </p>

          <h2 className="text-blue-600 text-xl md:text-2xl font-bold break-words">
            {formatar(lucro)}
          </h2>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className="bg-white p-3 md:p-6 rounded-2xl shadow w-full overflow-hidden">

        <div className="w-full h-[300px] md:h-[400px]">

          <ResponsiveContainer width="99%" height="100%">

            <BarChart
              data={dados}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <XAxis
                dataKey="dia"
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) =>
                  formatar(value)
                }
              />

              <Legend />

              <Bar
                dataKey="entrada"
                fill="#22c55e"
                name="Entradas"
                radius={[6, 6, 0, 0]}
              />

              <Bar
                dataKey="saida"
                fill="#ef4444"
                name="Saídas"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>

          </ResponsiveContainer>

        </div>
      </div>

    </div>
  );
}