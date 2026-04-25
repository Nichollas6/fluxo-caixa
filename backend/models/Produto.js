const mongoose = require("mongoose");

const ProdutoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
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

    // vínculo da loja
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// lucro automático
ProdutoSchema.virtual("lucroUnitario").get(function () {
  return this.preco - this.custo;
});

// evita duplicar nome apenas dentro da mesma loja
ProdutoSchema.index(
  {
    nome: 1,
    lojaId: 1
  },
  {
    unique: true
  }
);

module.exports =
  mongoose.models.Produto ||
  mongoose.model("Produto", ProdutoSchema);