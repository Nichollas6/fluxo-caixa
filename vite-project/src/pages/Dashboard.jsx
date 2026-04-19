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
    }, 5000); // ⏱️ atualiza a cada 5s

    return () => clearInterval(intervalo);
  }, [mes]);

  async function carregar() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/dashboard?mes=${mes}`);
      setDados(res.data || []);
    } catch (err) {
      console.log("Erro dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  // 📊 cálculos seguros
  const totalEntrada = dados.reduce((acc, item) => acc + (item.entrada || 0), 0);
  const totalSaida = dados.reduce((acc, item) => acc + (item.saida || 0), 0);
  const lucro = totalEntrada - totalSaida;

  // 💰 formatação moeda
  const formatar = (valor) =>
    valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard</h1>

        <div className="flex gap-3 items-center">
          <span>👤 {user?.email}</span>

          <select
            className="border p-2 rounded"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="1">Janeiro</option>
            <option value="2">Fevereiro</option>
            <option value="3">Março</option>
            <option value="4">Abril</option>
            <option value="5">Maio</option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="mb-4 text-gray-500">Carregando dados...</p>
      )}

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p>Entradas</p>
          <h2 className="text-green-600 text-xl font-bold">
            {formatar(totalEntrada)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Saídas</p>
          <h2 className="text-red-500 text-xl font-bold">
            {formatar(totalSaida)}
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p>Lucro</p>
          <h2 className="text-blue-600 text-xl font-bold">
            {formatar(lucro)}
          </h2>
        </div>

      </div>

      {/* GRÁFICO */}
      <div className="bg-white p-6 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dados}>
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip formatter={(value) => formatar(value)} />
            <Legend />
            <Bar dataKey="entrada" fill="#22c55e" name="Entradas" />
            <Bar dataKey="saida" fill="#ef4444" name="Saídas" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}