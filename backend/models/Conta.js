const mongoose = require("mongoose");

const ContaSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true,
      index: true
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
      trim: true,
      lowercase: true,
      default: "geral"
    }
  },
  {
    timestamps: true
  }
);


// ===========================
// INDEX PERFORMANCE
// ===========================
ContaSchema.index({
  lojaId: 1,
  data: -1
});


// ===========================
// NORMALIZA DADOS
// ===========================
ContaSchema.pre(
  "save",
  function (next) {

    if (this.descricao) {

      this.descricao =
        this.descricao.trim();
    }

    if (this.categoria) {

      this.categoria =
        this.categoria
          .trim()
          .toLowerCase();
    }

    this.valor =
      Number(this.valor || 0);

    next();
  }
);


module.exports =
  mongoose.models.Conta ||
  mongoose.model(
    "Conta",
    ContaSchema
  );