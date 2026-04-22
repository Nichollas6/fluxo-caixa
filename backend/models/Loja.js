const mongoose = require("mongoose");

const LojaSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Nome da loja é obrigatório"],
      trim: true
    },

    documento: {
      type: String,
      required: [true, "CPF/CNPJ é obrigatório"],
      trim: true,
      unique: true,
      minlength: [11, "Documento inválido"],
      maxlength: [14, "Documento inválido"]
    }
  },
  {
    timestamps: true
  }
);


// normaliza CPF/CNPJ antes de salvar
LojaSchema.pre("save", function (next) {
  try {
    if (this.documento) {
      this.documento = this.documento.replace(/\D/g, "");

      if (
        this.documento.length < 11 ||
        this.documento.length > 14
      ) {
        return next(new Error("CPF/CNPJ inválido"));
      }
    }

    next();

  } catch (err) {
    next(err);
  }
});


// evita recompilar model
module.exports =
  mongoose.models.Loja ||
  mongoose.model("Loja", LojaSchema);