const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());


// =========================
// 🔌 CONEXÃO MONGO
// =========================
mongoose.connect(
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/erp"
)
.then(() => console.log("🔥 Banco conectado"))
.catch(err => console.log("Erro Mongo:", err));


// =========================
// 🔐 AUTH MIDDLEWARE
// =========================
function auth(req, res, next) {
  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Token não enviado"
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;
    req.lojaId = decoded.lojaId;

    next();

  } catch (err) {

    return res.status(401).json({
      error: "Token inválido"
    });

  }
}


// =========================
// 📦 MODELOS
// =========================

// 🏪 LOJA
const Loja = mongoose.model("Loja", {
  nome: String,
  email: String,
  documento: String
});


// 🛒 VENDA
const Venda = mongoose.model("Venda", {

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  produto: String,
  cliente: String,
  vendedor: String,
  quantidade: Number,
  valor: Number,
  lucro: Number,

  data: {
    type: Date,
    default: Date.now
  }
});


// 💰 CONTAS
const Conta = mongoose.model("Conta", {

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  descricao: String,
  valor: Number,

  pago: {
    type: Boolean,
    default: false
  },

  data: {
    type: Date,
    default: Date.now
  }
});


// 📦 PRODUTO
const Produto = mongoose.model("Produto", {

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  nome: String,
  estoque: Number,
  preco: Number,
  custo: Number
});


// 🧾 CAIXA
const Caixa = mongoose.model("Caixa", {

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  abertoPor: String,

  status: {
    type: String,
    enum: ["aberto", "fechado"],
    default: "aberto"
  },

  saldoInicial: Number,
  saldoFinal: Number,

  entradas: {
    type: Number,
    default: 0
  },

  saidas: {
    type: Number,
    default: 0
  },

  totalVendas: {
    type: Number,
    default: 0
  },

  lucro: {
    type: Number,
    default: 0
  },

  dataAbertura: {
    type: Date,
    default: Date.now
  },

  dataFechamento: Date
});


// =========================
// 📊 DASHBOARD
// =========================
app.get("/dashboard", auth, async (req, res) => {
  try {

    const { mes } = req.query;

    let filtro = {
      lojaId: req.lojaId
    };

    if (mes) {

      const ano = new Date().getFullYear();

      const inicio =
        new Date(ano, mes - 1, 1);

      const fim =
        new Date(ano, mes, 0, 23, 59, 59);

      filtro.data = {
        $gte: inicio,
        $lte: fim
      };
    }

    const vendas =
      await Venda.find(filtro);

    const resumo = {};

    vendas.forEach((v) => {

      const dia =
        new Date(v.data).getDate();

      if (!resumo[dia]) {

        resumo[dia] = {
          dia,
          entrada: 0,
          saida: 0
        };
      }

      resumo[dia].entrada += v.valor;
    });

    res.json(Object.values(resumo));

  } catch (err) {

    console.log(err);

    res.status(500).json(
      "Erro dashboard"
    );
  }
});


// =========================
// 🛒 VENDAS
// =========================
app.post("/venda", auth, async (req, res) => {

  try {

    let {
      produtoId,
      cliente,
      qtd,
      vendedor
    } = req.body;

    qtd = Number(qtd);

    const caixa =
      await Caixa.findOne({
        status: "aberto",
        lojaId: req.lojaId
      });

    if (!caixa) {

      return res.status(400).json(
        "Abra o caixa primeiro"
      );
    }

    const produto =
      await Produto.findOne({
        _id: produtoId,
        lojaId: req.lojaId
      });

    if (!produto) {

      return res.status(404).json(
        "Produto não encontrado"
      );
    }

    if (produto.estoque < qtd) {

      return res.status(400).json(
        "Estoque insuficiente"
      );
    }

    // baixa estoque
    produto.estoque -= qtd;

    await produto.save();

    const total =
      produto.preco * qtd;

    const lucro =
      total - (produto.custo * qtd);

    const venda =
      await Venda.create({

        lojaId: req.lojaId,

        produto: produto.nome,

        cliente:
          cliente || "Balcão",

        vendedor:
          vendedor || "Sistema",

        quantidade: qtd,
        valor: total,
        lucro
      });

    // atualiza caixa
    caixa.entradas += total;
    caixa.totalVendas += total;
    caixa.lucro += lucro;

    await caixa.save();

    res.json(venda);

  } catch (err) {

    console.log(err);

    res.status(500).json(
      "Erro na venda"
    );
  }
});


// =========================
// 🧾 CAIXA
// =========================

// 🔍 VER
app.get("/caixa", auth, async (req, res) => {

  const caixa =
    await Caixa.findOne({
      status: "aberto",
      lojaId: req.lojaId
    });

  res.json(caixa);
});


// 🟢 ABRIR
app.post("/caixa/abrir", auth, async (req, res) => {

  const { usuario, valor } = req.body;

  const existe =
    await Caixa.findOne({
      status: "aberto",
      lojaId: req.lojaId
    });

  if (existe) {

    return res.status(400).json(
      "Já existe caixa aberto"
    );
  }

  const caixa =
    await Caixa.create({

      lojaId: req.lojaId,

      abertoPor: usuario,

      saldoInicial: Number(valor),

      entradas: 0,
      saidas: 0
    });

  res.json(caixa);
});


// 🔴 FECHAR
app.post("/caixa/fechar", auth, async (req, res) => {

  const caixa =
    await Caixa.findOne({
      status: "aberto",
      lojaId: req.lojaId
    });

  if (!caixa) {

    return res.status(400).json(
      "Nenhum caixa aberto"
    );
  }

  caixa.status = "fechado";

  caixa.saldoFinal =
    caixa.saldoInicial +
    caixa.entradas -
    caixa.saidas;

  caixa.dataFechamento =
    new Date();

  await caixa.save();

  res.json({
    caixa,
    totalVendas: caixa.totalVendas,
    lucro: caixa.lucro,
    entradas: caixa.entradas,
    saidas: caixa.saidas
  });
});


// =========================
// 💰 CONTAS
// =========================
app.get("/contas", auth, async (req, res) => {

  const contas =
    await Conta.find({
      lojaId: req.lojaId
    });

  res.json(contas);
});


app.post("/contas", auth, async (req, res) => {

  const nova =
    await Conta.create({

      ...req.body,

      lojaId: req.lojaId
    });

  res.json(nova);
});


// 🔥 PAGAR CONTA
app.put("/contas/:id", auth, async (req, res) => {

  const conta =
    await Conta.findOne({

      _id: req.params.id,

      lojaId: req.lojaId
    });

  if (!conta) {

    return res.status(404).json(
      "Conta não encontrada"
    );
  }

  if (conta.pago) {

    return res.status(400).json(
      "Conta já paga"
    );
  }

  conta.pago = true;

  await conta.save();

  const caixa =
    await Caixa.findOne({

      status: "aberto",

      lojaId: req.lojaId
    });

  if (caixa) {

    caixa.saidas += conta.valor;

    await caixa.save();
  }

  res.json(
    "Conta paga e descontada do caixa"
  );
});


// =========================
// 📦 PRODUTOS
// =========================
app.get("/produtos", auth, async (req, res) => {

  const produtos =
    await Produto.find({
      lojaId: req.lojaId
    });

  res.json(produtos);
});


app.post("/produtos", auth, async (req, res) => {

  const prod =
    await Produto.create({

      ...req.body,

      lojaId: req.lojaId
    });

  res.json(prod);
});


// =========================
// 🚀 START
// =========================
const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `🚀 Backend rodando na porta ${PORT}`
  );

});