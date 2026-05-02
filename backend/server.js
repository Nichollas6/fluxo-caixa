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

if (!process.env.JWT_SECRET) {

  console.log("⚠️ JWT_SECRET NÃO DEFINIDO");
}


// =========================
// CONFIG MONGOOSE
// =========================
mongoose.set("strictQuery", true);


// =========================
// CONEXÃO MONGO
// =========================
mongoose.connect(
  process.env.MONGO_URI,
  {
    dbName: "erp",
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000
  }
)
.then(() => {

  console.log("🔥 Mongo conectado");

})
.catch((err) => {

  console.log("❌ ERRO MONGO:");
  console.log(err.message);

  process.exit(1);
});


// =========================
// LOGS MONGOOSE
// =========================
mongoose.connection.on(
  "connected",
  () => {

    console.log("✅ Mongoose conectado");

  }
);

mongoose.connection.on(
  "error",
  (err) => {

    console.log("❌ Erro mongoose:");
    console.log(err.message);

  }
);

mongoose.connection.on(
  "disconnected",
  () => {

    console.log("⚠️ Mongo desconectado");

  }
);


// =========================
// TESTE API
// =========================
app.get("/", (req, res) => {

  return res.json({
    status: true,
    mensagem: "API rodando 🚀"
  });

});


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
// ROTA NÃO ENCONTRADA
// =========================
app.use((req, res) => {

  return res.status(404).json({
    erro: "Rota não encontrada"
  });

});


// =========================
// ERRO GLOBAL
// =========================
app.use((err, req, res, next) => {

  console.log("❌ ERRO GLOBAL:");
  console.log(err);

  return res.status(500).json({

    erro:
      err.message ||
      "Erro interno do servidor"

  });

});


// =========================
// START SERVER
// =========================
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Servidor rodando na porta ${PORT}`
  );

});