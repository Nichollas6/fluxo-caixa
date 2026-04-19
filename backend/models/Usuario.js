const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  senha: {
    type: String,
    required: true,
    select: false // 🔥 não retorna senha nas consultas
  },

  tipo: {
    type: String,
    enum: ["admin", "vendedor"],
    default: "vendedor"
  },

  ativo: {
    type: Boolean,
    default: true
  },

  criadoEm: {
    type: Date,
    default: Date.now
  }
});


// 🔐 CRIPTOGRAFAR SENHA AUTOMATICAMENTE
UsuarioSchema.pre("save", async function (next) {
  if (!this.isModified("senha")) return next();

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);

  next();
});


// 🔑 MÉTODO PARA VALIDAR SENHA
UsuarioSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};


module.exports = mongoose.model("Usuario", UsuarioSchema);