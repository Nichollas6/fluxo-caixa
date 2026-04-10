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

  const [vendaId, setVendaId] = useState("");
  const [quantidade, setQuantidade] = useState("");

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("dados") || "{}");
      setProdutos(data.produtos || []);
      setMovimentos(data.movimentos || []);
    } catch {
      console.log("erro ao carregar");
    }
  }, []);

  // 💾 SALVAR AUTOMÁTICO
  useEffect(() => {
    localStorage.setItem(
      "dados",
      JSON.stringify({ produtos, movimentos })
    );
  }, [produtos, movimentos]);

  // 💰 SALDO
  const saldo = movimentos.reduce((acc, m) => {
    return m.tipo === "entrada" ? acc + m.valor : acc - m.valor;
  }, 0);

  // 📊 GRÁFICO
  const relatorio = {};

  movimentos.forEach((m) => {
    if (!m?.data) return;

    const mes = new Date(m.data).toLocaleString("pt-BR", {
      month: "short",
    });

    if (!relatorio[mes]) relatorio[mes] = 0;
    relatorio[mes] += m.valor;
  });

  const dadosGrafico = Object.keys(relatorio).map((mes) => ({
    mes,
    valor: relatorio[mes],
  }));

  // ⚠️ ESTOQUE BAIXO
  const estoqueBaixo = produtos.filter((p) => p.estoque < 5);

  // 🛒 VENDA
  function vender() {
    const produto = produtos.find((p) => p.id == vendaId);
    const qtd = Number(quantidade);

    if (!produto || qtd <= 0) {
      alert("Selecione produto e quantidade válida");
      return;
    }

    if (produto.estoque < qtd) {
      alert("Estoque insuficiente");
      return;
    }

    produto.estoque -= qtd;

    const total = produto.preco * qtd;

    setMovimentos([
      ...movimentos,
      {
        tipo: "entrada",
        valor: total,
        data: new Date().toISOString(),
      },
    ]);

    setProdutos([...produtos]);
    setQuantidade("");
    setVendaId("");

    alert("Venda realizada com sucesso!");
  }

  function sair() {
    localStorage.removeItem("logado");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER MOBILE */}
      <div className="md:hidden bg-[#111827] text-white p-4 flex justify-between">
        <h1 className="font-bold">MK Imports</h1>
        <button onClick={sair} className="bg-red-500 px-3 py-1 rounded">
          Sair
        </button>
      </div>

      <div className="flex">

        {/* SIDEBAR */}
        <div className="hidden md:flex w-64 bg-[#111827] text-white p-6 flex-col min-h-screen">
          <h1 className="text-2xl font-bold mb-6">MK Imports</h1>

          <ul className="space-y-3">
            <li>Dashboard</li>
            <li>Produtos</li>
            <li>Vendas</li>
          </ul>

          <button onClick={sair} className="mt-10 bg-red-500 p-2 rounded">
            Sair
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="flex-1 p-4 md:p-6">

          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Dashboard
          </h1>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-4 rounded-2xl shadow">
              <p>Saldo</p>
              <h2 className="text-2xl text-green-600 font-bold">
                R$ {saldo.toFixed(2)}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <p>Vendas</p>
              <h2 className="text-2xl font-bold">
                {movimentos.length}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <p>Produtos</p>
              <h2 className="text-2xl font-bold">
                {produtos.length}
              </h2>
            </div>

          </div>

          {/* 🛒 VENDA RESPONSIVA */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-6">
            <h2 className="mb-4 font-semibold">Realizar Venda</h2>

            <div className="flex flex-col md:flex-row gap-3">

              <select
                value={vendaId}
                onChange={(e) => setVendaId(e.target.value)}
                className="border p-3 rounded w-full"
              >
                <option value="">Selecione o produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="border p-3 rounded w-full"
              />

              <button
                onClick={vender}
                className="bg-green-500 text-white p-3 rounded w-full md:w-auto active:scale-95 transition"
              >
                Vender
              </button>

            </div>
          </div>

          {/* GRÁFICO */}
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="mb-4 font-semibold">Vendas por mês</h2>

            {dadosGrafico.length === 0 ? (
              <p>Sem dados</p>
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

          {/* ESTOQUE */}
          <div className="bg-white p-6 rounded-2xl shadow mb-6">
            <h2 className="text-red-500 font-semibold mb-4">
              ⚠️ Estoque baixo
            </h2>

            {estoqueBaixo.length === 0 ? (
              <p>Sem alertas</p>
            ) : (
              estoqueBaixo.map((p) => (
                <p key={p.id}>
                  {p.nome} - {p.estoque}
                </p>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}