const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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

    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);


// 🔥 HASH DA SENHA
UsuarioSchema.pre("save", async function (next) {
  try {
    // normaliza email
    this.email = this.email.trim().toLowerCase();

    // só faz hash se a senha foi alterada
    if (!this.isModified("senha")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);

    next();
  } catch (err) {
    next(err);
  }
});


// 🔐 COMPARAR SENHA
UsuarioSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};


// 🔥 EVITA DUPLICAÇÃO DO MODEL
module.exports =
  mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);