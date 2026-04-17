const mongoose = require("mongoose");

module.exports = mongoose.model("Conta", {
  descricao: String,
  valor: Number,
  pago: Boolean,
  data: Date
});