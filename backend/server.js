require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// =========================
// VERIFICA ENV
// =========================
if (!process.env.MONGO_URI) {
  console.log("❌ MONGO_URI NÃO DEFINIDA");
  process.exit(1);
}

// =========================
// ROTAS
// =========================
app.use("/login", require("./routes/loginRoutes"));
app.use("/loja", require("./routes/lojaRoutes"));
app.use("/usuarios", require("./routes/usuarioRoutes"));
app.use("/produtos", require("./routes/produtoRoutes"));
app.use("/clientes", require("./routes/clienteRoutes"));
app.use("/vendas", require("./routes/vendaRoutes"));
app.use("/recibo", require("./routes/reciboRoutes"));
app.use("/caixa", require("./routes/caixaRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use("/contas", require("./routes/contaRoutes"));

// =========================
// HEALTH CHECK
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    message: "API rodando 🚀"
  });
});

// =========================
// 404
// =========================
app.use((req, res) => {
  res.status(404).json({
    erro: "Rota não encontrada"
  });
});

// =========================
// ERRO GLOBAL
// =========================
app.use((err, req, res, next) => {
  console.error("ERRO:", err);

  res.status(500).json({
    erro: err.message || "Erro interno"
  });
});

// =========================
// PORTA DO RENDER
// =========================
const PORT = Number(process.env.PORT) || 10000;

// =========================
// CONECTA MONGO E SOBE SERVER
// =========================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🔥 Mongo conectado");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ ERRO MONGO:", err.message);
    process.exit(1);
  });