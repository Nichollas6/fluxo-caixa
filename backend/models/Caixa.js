const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema(
  {
    abertoPor: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["aberto", "fechado"],
      default: "aberto"
    },

    saldoInicial: {
      type: Number,
      required: true,
      default: 0
    },

    saldoFinal: {
      type: Number,
      default: 0
    },

    totalVendas: {
      type: Number,
      default: 0
    },

    lucro: {
      type: Number,
      default: 0
    },

    dataAbertura: {
      type: Date,
      default: Date.now
    },

    dataFechamento: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Caixa", CaixaSchema);