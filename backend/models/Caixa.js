const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema(
  {
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


// 🔥 GARANTE APENAS 1 CAIXA ABERTO
CaixaSchema.index(
  { status: 1 },
  { unique: true, partialFilterExpression: { status: "aberto" } }
);


// 🔥 ATUALIZA SALDO AUTOMATICAMENTE
CaixaSchema.pre("save", function (next) {
  this.saldoAtual =
    this.saldoInicial + this.entradas - this.saidas;
  next();
});


// 🔥 EVITA DUPLICAÇÃO DO MODEL
module.exports =
  mongoose.models.Caixa || mongoose.model("Caixa", CaixaSchema);