const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      trim: true
    },

    senha: {
      type: String,
      required: [true, "Senha é obrigatória"],
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
      required: [true, "Loja é obrigatória"]
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


// HASH DA SENHA
UsuarioSchema.pre("save", async function () {
  // normaliza email
  if (this.email) {
    this.email = this.email.trim().toLowerCase();
  }

  // só faz hash se senha mudou
  if (!this.isModified("senha")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});


// comparar senha
UsuarioSchema.methods.compararSenha = function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};


// evita duplicação
module.exports =
  mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);