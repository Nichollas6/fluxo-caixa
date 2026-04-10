import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [produtos, setProdutos] = useState([]);
  const [movimentos, setMovimentos] = useState([]);

  // 🔥 CARREGAR DADOS (SEGURO)
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("dados") || "{}");

      setProdutos(data.produtos || []);
      setMovimentos(data.movimentos || []);
    } catch (e) {
      console.log("Erro ao carregar dados");
    }
  }, []);

  // 💰 SALDO SEGURO
  const saldo = (movimentos || []).reduce((acc, m) => {
    return m.tipo === "entrada" ? acc + m.valor : acc - m.valor;
  }, 0);

  // 📊 RELATÓRIO POR MÊS
  const relatorio = {};

  (movimentos || []).forEach((m) => {
    if (!m?.data) return;

    const mes = new Date(m.data).toLocaleString("pt-BR", {
      month: "short",
    });

    if (!relatorio[mes]) relatorio[mes] = 0;
    relatorio[mes] += m.valor;
  });

  const dadosGrafico = Object.keys(relatorio || {}).map((mes) => ({
    mes,
    valor: relatorio[mes],
  }));

  // ⚠️ ESTOQUE BAIXO
  const estoqueBaixo = (produtos || []).filter(
    (p) => p.estoque < 5
  );

  function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/login";
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 bg-[#111827] text-white p-6">
        <h1 className="text-2xl font-bold mb-6">MK Imports</h1>

        <ul className="space-y-3">
          <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
          <li className="hover:text-gray-300 cursor-pointer">Produtos</li>
          <li className="hover:text-gray-300 cursor-pointer">Vendas</li>
        </ul>

        <button
          onClick={sair}
          className="mt-10 bg-red-500 w-full p-2 rounded"
        >
          Sair
        </button>
      </div>

      {/* CONTEÚDO */}
      <div className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Saldo</p>
            <h2 className="text-2xl font-bold text-green-600">
              R$ {saldo.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Vendas</p>
            <h2 className="text-2xl font-bold">
              {movimentos.length}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <p className="text-gray-500">Produtos</p>
            <h2 className="text-2xl font-bold">
              {produtos.length}
            </h2>
          </div>

        </div>

        {/* GRÁFICO */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="mb-4 font-semibold">Vendas por mês</h2>

          {dadosGrafico.length === 0 ? (
            <p>Sem dados ainda</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dadosGrafico}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ESTOQUE BAIXO */}
        <div className="bg-white p-6 rounded-2xl shadow mb-6">
          <h2 className="mb-4 font-semibold text-red-500">
            ⚠️ Estoque baixo
          </h2>

          {estoqueBaixo.length === 0 ? (
            <p>Sem alertas</p>
          ) : (
            estoqueBaixo.map((p) => (
              <p key={p.id}>
                {p.nome} - {p.estoque} unidades
              </p>
            ))
          )}
        </div>

        {/* PRODUTOS */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="mb-4 font-semibold">
            Produtos
          </h2>

          {produtos.length === 0 ? (
            <p>Nenhum produto cadastrado</p>
          ) : (
            produtos.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex justify-between border-b py-2"
              >
                <span>{p.nome}</span>
                <span>R$ {p.preco}</span>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}