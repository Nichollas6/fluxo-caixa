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

// índice correto
LojaSchema.index({ documento: 1 }, { unique: true });
LojaSchema.index({ email: 1 }, { unique: true });

// normalização segura
LojaSchema.pre("save", function (next) {
  try {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }

    if (this.documento) {
      this.documento = this.documento.replace(/\D/g, "");

      if (this.documento.length < 11 || this.documento.length > 14) {
        return next(new Error("Documento inválido"));
      }
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports =
  mongoose.models.Loja ||
  mongoose.model("Loja", LojaSchema);