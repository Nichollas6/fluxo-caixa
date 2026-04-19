const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema({
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

  // 📊 CRM
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

  // 🕒 controle
  criadoEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cliente", ClienteSchema);