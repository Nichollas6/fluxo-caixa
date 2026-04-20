const mongoose = require("mongoose");

const LojaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true
    },

    documento: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 11,
      maxlength: 14
    }
  },
  {
    timestamps: true
  }
);


// 🔥 índice garantido
LojaSchema.index({ documento: 1 }, { unique: true });


// 🔥 NORMALIZA CPF/CNPJ
LojaSchema.pre("save", function (next) {
  if (this.documento) {
    this.documento = this.documento.replace(/\D/g, "");

    if (!this.documento) {
      return next(new Error("Documento inválido"));
    }
  }
  next();
});


// 🔥 evita duplicação do model
module.exports =
  mongoose.models.Loja || mongoose.model("Loja", LojaSchema);