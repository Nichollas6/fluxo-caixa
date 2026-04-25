const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    abertoPor: {
      type: String,
      required: true,
      trim: true
    },

    status: {
      type: String,
      enum: ["aberto", "fechado"],
      default: "aberto"
    },

    saldoInicial: {
      type: Number,
      required: true,
      min: 0
    },

    saldoAtual: {
      type: Number,
      default: 0,
      min: 0
    },

    entradas: {
      type: Number,
      default: 0,
      min: 0
    },

    saidas: {
      type: Number,
      default: 0,
      min: 0
    },

    totalVendas: {
      type: Number,
      default: 0,
      min: 0
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
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// apenas 1 caixa aberto POR LOJA
CaixaSchema.index(
  {
    lojaId: 1,
    status: 1
  },
  {
    unique: true,
    partialFilterExpression: {
      status: { $eq: "aberto" }
    }
  }
);


// atualiza saldo automático
CaixaSchema.pre("save", function () {
  this.saldoAtual =
    this.saldoInicial +
    this.entradas -
    this.saidas;
});


module.exports =
  mongoose.models.Caixa ||
  mongoose.model("Caixa", CaixaSchema);