const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    abertoPor: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["aberto", "fechado"],
      default: "aberto"
    },

    saldoInicial: {
      type: Number,
      required: true,
      min: 0
    },

    saldoAtual: {
      type: Number,
      default: 0,
      min: 0
    },

    entradas: {
      type: Number,
      default: 0,
      min: 0
    },

    saidas: {
      type: Number,
      default: 0,
      min: 0
    },

    totalVendas: {
      type: Number,
      default: 0,
      min: 0
    },

    lucro: {
      type: Number,
      default: 0
    },

    dataAbertura: {
      type: Date,
      default: Date.now
    },

    dataFechamento: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// ===============================
// APENAS 1 CAIXA ABERTO POR LOJA
// ===============================
CaixaSchema.index(
  {
    lojaId: 1,
    status: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      status: "aberto"
    }
  }
);


// ===============================
// ATUALIZA SALDO AUTOMÁTICO
// ===============================
CaixaSchema.pre(
  "save",
  function (next) {

    this.saldoAtual =
      Number(this.saldoInicial || 0) +
      Number(this.entradas || 0) -
      Number(this.saidas || 0);

    next();
  }
);


module.exports =
  mongoose.models.Caixa ||
  mongoose.model(
    "Caixa",
    CaixaSchema
  );