const mongoose = require("mongoose");

module.exports = mongoose.model("Caixa", {
  abertoPor: String,
  saldoInicial: Number,
  saldoFinal: Number,
  status: String,
  dataAbertura: Date,
  dataFechamento: Date
});