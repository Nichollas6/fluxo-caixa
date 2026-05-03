const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: { type: String, trim: true, default: "" },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    senha: {
      type: String,
      required: true,
      select: false
    },

    tipo: {
      type: String,
      enum: ["admin", "vendedor"],
      default: "vendedor"
    },

    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// índice
UsuarioSchema.index({ email: 1 }, { unique: true });

// hash senha
UsuarioSchema.pre("save", async function () {
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  if (!this.isModified("senha")) return;

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// comparar senha
UsuarioSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports =
  mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);