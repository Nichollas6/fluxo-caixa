const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true,
      index: true
    },

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

    // =========================
    // CRM
    // =========================
    totalCompras: {
      type: Number,
      default: 0,
      min: 0
    },

    totalGasto: {
      type: Number,
      default: 0,
      min: 0
    },

    ultimaCompra: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);


// =========================
// EVITA CLIENTE DUPLICADO
// NA MESMA LOJA
// =========================
ClienteSchema.index(
  {
    lojaId: 1,
    nome: 1
  },
  {
    unique: true
  }
);


// =========================
// NORMALIZA NOME
// =========================
ClienteSchema.pre(
  "save",
  function (next) {

    if (this.nome) {

      this.nome =
        this.nome
          .trim()
          .toLowerCase();
    }

    next();
  }
);


module.exports =
  mongoose.models.Cliente ||
  mongoose.model(
    "Cliente",
    ClienteSchema
  );