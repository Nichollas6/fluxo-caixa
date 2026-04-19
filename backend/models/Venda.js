const mongoose = require("mongoose");

const VendaSchema = new mongoose.Schema({
  produto: {
    type: String,
    required: true
  },

  cliente: {
    type: String,
    default: "Balcão"
  },

  vendedor: {
    type: String,
    default: "Sistema"
  },

  quantidade: {
    type: Number,
    required: true
  },

  valor: {
    type: Number,
    required: true
  },

  lucro: {
    type: Number,
    required: true
  },

  data: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Venda", VendaSchema);