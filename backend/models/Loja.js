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


// normaliza CPF/CNPJ
LojaSchema.pre("save", async function () {
  if (this.documento) {
    this.documento = this.documento.replace(/\D/g, "");

    if (
      this.documento.length < 11 ||
      this.documento.length > 14
    ) {
      throw new Error("Documento inválido");
    }
  }
});


module.exports =
  mongoose.models.Loja ||
  mongoose.model("Loja", LojaSchema);