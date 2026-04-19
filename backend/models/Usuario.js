const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
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

  ativo: {
    type: Boolean,
    default: true
  }
});

// hash senha
UsuarioSchema.pre("save", async function () {
  if (!this.isModified("senha")) return;
  this.senha = await bcrypt.hash(this.senha, 10);
});

UsuarioSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = mongoose.model("Usuario", UsuarioSchema);