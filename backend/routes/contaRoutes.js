const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema({
  abertoPor: String,

  status: {
    type: String,
    enum: ["aberto", "fechado"],
    default: "aberto"
  },

  saldoInicial: { type: Number, required: true },

  saldoAtual: { type: Number, default: 0 },

  entradas: { type: Number, default: 0 },
  saidas: { type: Number, default: 0 },

  lucro: { type: Number, default: 0 },

  dataAbertura: { type: Date, default: Date.now },
  dataFechamento: Date
});

module.exports = mongoose.model("Caixa", CaixaSchema);