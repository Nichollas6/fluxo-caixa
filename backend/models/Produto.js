const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true
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
    }
  },
  {
    timestamps: true
  }
);

// virtual lucro
ProdutoSchema.virtual("lucroUnitario").get(function () {
  return this.preco - this.custo;
});

module.exports = mongoose.model("Produto", ProdutoSchema);