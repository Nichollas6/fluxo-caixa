const mongoose = require("mongoose");

const LojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },

  documento: {
    type: String,
    required: true,
    unique: true // CPF ou CNPJ
  },

  criadaEm: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Loja", LojaSchema);