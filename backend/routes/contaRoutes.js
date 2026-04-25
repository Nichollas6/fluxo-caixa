const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema({
  abertoPor: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["aberto", "fechado"],
    default: "aberto"
  },

  saldoInicial: {
    type: Number,
    required: true,
    default: 0
  },

  saldoAtual: {
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

module.exports =
  mongoose.models.Caixa ||
  mongoose.model("Caixa", CaixaSchema);