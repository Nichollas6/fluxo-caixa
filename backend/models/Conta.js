const mongoose = require("mongoose");

const ContaSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    descricao: {
      type: String,
      required: true,
      trim: true
    },

    valor: {
      type: Number,
      required: true,
      min: 0
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
  },
  {
    timestamps: true
  }
);

module.exports =
  mongoose.models.Conta ||
  mongoose.model("Conta", ContaSchema);