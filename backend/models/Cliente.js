const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  nome: {
    type: String,
    required: true,
    trim: true
  },

  telefone: {
    type: String,
    trim: true,
    default: ""
  },

  // CRM
  totalCompras: {
    type: Number,
    default: 0
  },

  totalGasto: {
    type: Number,
    default: 0
  },

  ultimaCompra: {
    type: Date,
    default: null
  },

  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports =
  mongoose.models.Cliente ||
  mongoose.model("Cliente", ClienteSchema);