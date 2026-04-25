require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// 🔐 MIDDLEWARES
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔌 CONEXÃO MONGO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log("❌ Erro Mongo:", err));

// 🧪 TESTE API
app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

// =========================
// 📦 ROTAS
// =========================

// 🔑 LOGIN
app.use("/login", require("./routes/loginRoutes"));

// 🏪 LOJA
app.use("/loja", require("./routes/lojaRoutes"));

// 👤 USUÁRIOS
app.use("/usuarios", require("./routes/usuarioRoutes"));

// 📦 PRODUTOS
app.use("/produtos", require("./routes/produtoRoutes"));

// 👥 CLIENTES
app.use("/clientes", require("./routes/clienteRoutes"));

// 💰 VENDAS
app.use("/vendas", require("./routes/vendaRoutes"));

// 🧾 RECIBO ← ADICIONADO
app.use("/recibo", require("./routes/reciboRoutes"));

// 💵 CAIXA
app.use("/caixa", require("./routes/caixaRoutes"));

// 📊 DASHBOARD
app.use("/dashboard", require("./routes/dashboardRoutes"));

// 💸 CONTAS
app.use("/contas", require("./routes/contaRoutes"));


// =========================
// 🚀 START SERVER
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});