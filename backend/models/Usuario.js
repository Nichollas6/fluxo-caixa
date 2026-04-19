const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
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
});

// 🔥 LIMPEZA + HASH
UsuarioSchema.pre("save", async function () {
  this.email = this.email.trim().toLowerCase();
  this.senha = this.senha.trim();

  if (!this.isModified("senha")) return;

  this.senha = await bcrypt.hash(this.senha, 10);
});

// comparação
UsuarioSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model("Usuario", UsuarioSchema);