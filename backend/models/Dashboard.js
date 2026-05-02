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
  "mongodb://127.0.0.1:27017/erp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => {
  console.log("🔥 Banco conectado");
})
.catch((err) => {
  console.log("❌ Erro Mongo:", err.message);
});


// =========================
// 🔐 AUTH MIDDLEWARE
// =========================
function auth(req, res, next) {

  try {

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {

      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    const parts =
      authHeader.split(" ");

    if (parts.length !== 2) {

      return res.status(401).json({
        erro: "Token mal formatado"
      });
    }

    const [scheme, token] =
      parts;

    if (!/^Bearer$/i.test(scheme)) {

      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
      "segredo_super_forte"
    );

    req.user = decoded;

    req.userId =
      decoded.id;

    req.lojaId =
      decoded.lojaId;

    next();

  } catch (err) {

    console.log(
      "❌ ERRO AUTH:",
      err.message
    );

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
}


// =========================
// 📦 MODELOS
// =========================

// 🏪 LOJA
const LojaSchema =
  new mongoose.Schema({

    nome: String,
    email: String,
    documento: String

  });

const Loja =
  mongoose.models.Loja ||
  mongoose.model(
    "Loja",
    LojaSchema
  );


// 🛒 VENDA
const VendaSchema =
  new mongoose.Schema({

    lojaId: {
      type:
        mongoose.Schema.Types.ObjectId,
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

const Venda =
  mongoose.models.Venda ||
  mongoose.model(
    "Venda",
    VendaSchema
  );


// 💰 CONTA
const ContaSchema =
  new mongoose.Schema({

    lojaId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    descricao: String,

    valor: {
      type: Number,
      default: 0
    },

    pago: {
      type: Boolean,
      default: false
    },

    data: {
      type: Date,
      default: Date.now
    },

    dataPagamento: {
      type: Date,
      default: null
    }

  });

const Conta =
  mongoose.models.Conta ||
  mongoose.model(
    "Conta",
    ContaSchema
  );


// 📦 PRODUTO
const ProdutoSchema =
  new mongoose.Schema({

    lojaId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    nome: String,

    estoque: {
      type: Number,
      default: 0
    },

    preco: {
      type: Number,
      default: 0
    },

    custo: {
      type: Number,
      default: 0
    }

  });

const Produto =
  mongoose.models.Produto ||
  mongoose.model(
    "Produto",
    ProdutoSchema
  );


// 🧾 CAIXA
const CaixaSchema =
  new mongoose.Schema({

    lojaId: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    abertoPor: String,

    status: {
      type: String,
      enum: [
        "aberto",
        "fechado"
      ],
      default: "aberto"
    },

    saldoInicial: {
      type: Number,
      default: 0
    },

    saldoFinal: {
      type: Number,
      default: 0
    },

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

const Caixa =
  mongoose.models.Caixa ||
  mongoose.model(
    "Caixa",
    CaixaSchema
  );


// =========================
// 📊 DASHBOARD
// =========================
app.get(
  "/dashboard",
  auth,
  async (req, res) => {

    try {

      const { mes } =
        req.query;

      let filtro = {
        lojaId: req.lojaId
      };

      if (mes) {

        const ano =
          new Date()
          .getFullYear();

        const inicio =
          new Date(
            ano,
            Number(mes) - 1,
            1
          );

        const fim =
          new Date(
            ano,
            Number(mes),
            0,
            23,
            59,
            59
          );

        filtro.data = {
          $gte: inicio,
          $lte: fim
        };
      }

      const vendas =
        await Venda.find(
          filtro
        );

      const resumo = {};

      vendas.forEach((v) => {

        const dia =
          new Date(v.data)
          .getDate();

        if (!resumo[dia]) {

          resumo[dia] = {
            dia,
            entrada: 0,
            saida: 0
          };
        }

        resumo[dia]
        .entrada +=
          Number(v.valor || 0);
      });

      res.json(
        Object.values(resumo)
      );

    } catch (err) {

      console.log(
        "❌ ERRO DASHBOARD:",
        err
      );

      res.status(500).json({
        erro:
          "Erro dashboard"
      });
    }
  }
);


// =========================
// 🛒 VENDAS
// =========================
app.post(
  "/venda",
  auth,
  async (req, res) => {

    try {

      let {
        produtoId,
        cliente,
        qtd,
        vendedor
      } = req.body;

      qtd = Number(qtd);

      if (!produtoId || !qtd) {

        return res.status(400)
        .json({
          erro:
            "Dados inválidos"
        });
      }

      const caixa =
        await Caixa.findOne({

          status: "aberto",

          lojaId:
            req.lojaId
        });

      if (!caixa) {

        return res.status(400)
        .json({
          erro:
            "Abra o caixa primeiro"
        });
      }

      const produto =
        await Produto.findOne({

          _id: produtoId,

          lojaId:
            req.lojaId
        });

      if (!produto) {

        return res.status(404)
        .json({
          erro:
            "Produto não encontrado"
        });
      }

      if (
        produto.estoque < qtd
      ) {

        return res.status(400)
        .json({
          erro:
            "Estoque insuficiente"
        });
      }

      produto.estoque -= qtd;

      await produto.save();

      const total =
        Number(produto.preco)
        * qtd;

      const lucro =
        total -
        (
          Number(produto.custo)
          * qtd
        );

      const venda =
        await Venda.create({

          lojaId:
            req.lojaId,

          produto:
            produto.nome,

          cliente:
            cliente ||
            "Balcão",

          vendedor:
            vendedor ||
            "Sistema",

          quantidade:
            qtd,

          valor:
            total,

          lucro
        });

      caixa.entradas += total;
      caixa.totalVendas += total;
      caixa.lucro += lucro;

      await caixa.save();

      res.json(venda);

    } catch (err) {

      console.log(
        "❌ ERRO VENDA:",
        err
      );

      res.status(500)
      .json({
        erro:
          "Erro na venda"
      });
    }
  }
);


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