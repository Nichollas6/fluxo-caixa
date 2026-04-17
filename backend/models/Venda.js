const mongoose = require("mongoose");

const VendaSchema = new mongoose.Schema({
  dia: String,
  mes: Number,
  entrada: Number,
  saida: Number,
});

module.exports = mongoose.model("Venda", VendaSchema);