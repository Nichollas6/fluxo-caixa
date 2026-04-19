const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
    unique: true // 👈 mantém só isso
  },

  preco: {
    type: Number,
    required: true,
    min: 0
  },

  custo: {
    type: Number,
    required: true,
    min: 0
  },

  estoque: {
    type: Number,
    default: 0,
    min: 0
  },

  categoria: {
    type: String,
    default: "geral"
  },

  ativo: {
    type: Boolean,
    default: true
  },

  criadoEm: {
    type: Date,
    default: Date.now
  },

  atualizadoEm: {
    type: Date
  }
});

// 🔄 atualização automática
ProdutoSchema.pre("save", function (next) {
  this.atualizadoEm = new Date();
  next();
});

// 📊 lucro automático
ProdutoSchema.virtual("lucroUnitario").get(function () {
  return this.preco - this.custo;
});

// ❌ REMOVER ISSO:
// ProdutoSchema.index({ nome: 1 });

module.exports = mongoose.model("Produto", ProdutoSchema);