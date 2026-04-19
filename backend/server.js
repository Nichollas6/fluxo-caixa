require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 CONEXÃO
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔥 Mongo conectado"))
  .catch(err => console.log(err));

// 📦 ROTAS
app.use("/produtos", require("./routes/produtoRoutes"));
app.use("/clientes", require("./routes/clienteRoutes"));
app.use("/venda", require("./routes/vendaRoutes"));
app.use("/caixa", require("./routes/caixaRoutes"));
app.use("/contas", require("./routes/contaRoutes"));
app.use("/usuarios", require("./routes/usuarioRoutes"));
app.use("/login", require("./routes/loginRoutes"));
app.use("/dashboard", require("./routes/dashboardRoutes"));
app.use("/lojas", require("./routes/lojaRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Rodando na porta " + PORT);
});