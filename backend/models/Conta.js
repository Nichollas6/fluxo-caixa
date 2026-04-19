const mongoose = require("mongoose");

const ContaSchema = new mongoose.Schema({
  descricao: {
    type: String,
    required: true,
    trim: true
  },

  valor: {
    type: Number,
    required: true
  },

  tipo: {
    type: String,
    enum: ["saida", "entrada"],
    default: "saida"
  },

  pago: {
    type: Boolean,
    default: false
  },

  data: {
    type: Date,
    default: Date.now
  },

  dataPagamento: {
    type: Date,
    default: null
  },

  categoria: {
    type: String,
    default: "geral"
  }

});

module.exports = mongoose.model("Conta", ContaSchema);