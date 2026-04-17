const express = require("express");
<<<<<<< HEAD
const cors = require("cors");
const conectar = require("./config/db");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// conexão
conectar();

// rotas
app.use("/produtos", require("./routes/produtoRoutes"));
app.use("/clientes", require("./routes/clienteRoutes"));
app.use("/venda", require("./routes/vendaRoutes"));
app.use("/caixa", require("./routes/caixaRoutes"));
app.use("/contas", require("./routes/contaRoutes"));
app.use("/usuarios", require("./routes/usuarioRoutes"));
app.use("/login", require("./routes/loginRoutes"));

// dashboard
app.use("/dashboard", require("./routes/dashboardRoutes"));

app.listen(3000, () => {
  console.log("🔥 Servidor rodando na porta 3000");
});
=======
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 conexão banco
mongoose.connect("mongodb://admin:UD3wTmG2oMtwXcmz@ac-mfudtgv-shard-00-00.rsmsoha.mongodb.net:27017,ac-mfudtgv-shard-00-01.rsmsoha.mongodb.net:27017,ac-mfudtgv-shard-00-02.rsmsoha.mongodb.net:27017/mkimports?ssl=true&replicaSet=atlas-eoqmky-shard-0&authSource=admin&retryWrites=true&w=majority")
  .then(() => console.log("Banco conectado 🔥"))
  .catch(err => console.log(err));

// 📦 PRODUTOS
const Produto = mongoose.model("Produto", {
  nome: String,
  preco: Number,
  custo: Number,
  estoque: Number
});

app.get("/produtos", async (req, res) => {
  const dados = await Produto.find();
  res.json(dados);
});

app.post("/produtos", async (req, res) => {
  const novo = await Produto.create(req.body);
  res.json(novo);
});

// 💰 VENDAS
const Venda = mongoose.model("Venda", {
  produto: String,
  valor: Number,
  lucro: Number,
  data: Date
});

// 🔥 ROTAS

// produtos
app.get("/produtos", async (req, res) => {
  const dados = await Produto.find();
  res.json(dados);
});

app.post("/produtos", async (req, res) => {
  const novo = await Produto.create(req.body);
  res.json(novo);
});

// venda
app.post("/venda", async (req, res) => {
  const { produtoId, qtd } = req.body;

  const produto = await Produto.findById(produtoId);

  if (!produto || produto.estoque < qtd) {
    return res.status(400).json({ erro: "Estoque insuficiente" });
  }

  produto.estoque -= qtd;
  await produto.save();

  const total = produto.preco * qtd;
  const lucro = total - (produto.custo * qtd);

  await Venda.create({
    produto: produto.nome,
    valor: total,
    lucro,
    data: new Date()
  });

  res.json({ sucesso: true });
});

app.listen(3000, () => console.log("Servidor rodando 🚀"));
>>>>>>> 36db1477aee007824b6cf9c6a683a7fa1aad7338
