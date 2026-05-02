const mongoose = require("mongoose");

const LojaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },

    telefone: {
      type: String,
      default: ""
    },

    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    plano: {
      type: String,
      enum: ["free", "premium"],
      default: "free"
    },

    status: {
      type: String,
      enum: ["ativo", "bloqueado"],
      default: "ativo"
    }
  },
  {
    timestamps: true
  }
);


// =========================
// NORMALIZA CPF/CNPJ
// =========================
LojaSchema.pre("save", function () {

  // normaliza email
  if (this.email) {

    this.email =
      this.email
      .trim()
      .toLowerCase();
  }

  // normaliza documento
  if (this.documento) {

    this.documento =
      this.documento.replace(/\D/g, "");

    // valida tamanho
    if (
      this.documento.length < 11 ||
      this.documento.length > 14
    ) {

      throw new Error(
        "Documento inválido"
      );
    }
  }
});


// =========================
// EXPORT
// =========================
module.exports =
  mongoose.models.Loja ||
  mongoose.model(
    "Loja",
    LojaSchema
  );