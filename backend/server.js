const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// 🔥 middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🔗 conexão Mongo (Render usa variável)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Banco conectado"))
  .catch(err => console.log("Erro Mongo:", err));

// 📦 ROTAS
app.use("/produtos", require("./routes/produtoRoutes"));
app.use("/clientes", require("./routes/clienteRoutes"));
app.use("/venda", require("./routes/vendaRoutes"));
app.use("/caixa", require("./routes/caixaRoutes"));
app.use("/contas", require("./routes/contaRoutes"));
app.use("/usuarios", require("./routes/usuarioRoutes"));
app.use("/login", require("./routes/loginRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));

// 🚀 PORTA DINÂMICA (OBRIGATÓRIO NO RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});