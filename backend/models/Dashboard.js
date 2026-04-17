const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 CONEXÃO MONGO
mongoose.connect("mongodb://127.0.0.1:27017/erp");

// =========================
// 📦 MODELOS
// =========================

const Venda = mongoose.model("Venda", {
  dia: String,        // ex: "Seg", "Ter"
  mes: Number,        // 1 - 12
  entrada: Number,    // dinheiro entrando
  saida: Number,      // dinheiro saindo
});

const Conta = mongoose.model("Conta", {
  descricao: String,
  valor: Number,
  pago: { type: Boolean, default: false },
});

const Produto = mongoose.model("Produto", {
  nome: String,
  estoque: Number,
});

// =========================
// 📊 DASHBOARD PRINCIPAL
// =========================
app.get("/dashboard", async (req, res) => {
  try {
    const { mes } = req.query;

    let filtro = {};

    if (mes) {
      filtro.mes = Number(mes);
    }

    const vendas = await Venda.find(filtro);

    // 📊 AGRUPAR POR DIA
    const resumo = {};

    vendas.forEach((v) => {
      if (!resumo[v.dia]) {
        resumo[v.dia] = {
          dia: v.dia,
          entrada: 0,
          saida: 0,
        };
      }

      resumo[v.dia].entrada += v.entrada || 0;
      resumo[v.dia].saida += v.saida || 0;
    });

    res.json(Object.values(resumo));
  } catch (err) {
    res.status(500).json({ error: "Erro dashboard" });
  }
});

// =========================
// 💰 CONTAS
// =========================
app.get("/contas", async (req, res) => {
  const contas = await Conta.find();
  res.json(contas);
});

app.post("/contas", async (req, res) => {
  const nova = await Conta.create(req.body);
  res.json(nova);
});

app.put("/contas/:id", async (req, res) => {
  await Conta.findByIdAndUpdate(req.params.id, { pago: true });
  res.json({ ok: true });
});

// =========================
// 📦 PRODUTOS
// =========================
app.get("/produtos", async (req, res) => {
  const produtos = await Produto.find();
  res.json(produtos);
});

app.post("/produtos", async (req, res) => {
  const prod = await Produto.create(req.body);
  res.json(prod);
});

// =========================
// 🚀 START SERVER
// =========================
app.listen(3000, () => {
  console.log("🔥 Backend ERP rodando na porta 3000");
});