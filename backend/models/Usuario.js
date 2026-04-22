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

    // 🔥 vínculo com loja
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
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


// HASH SENHA
UsuarioSchema.pre("save", async function (next) {
  try {
    this.email = this.email.trim().toLowerCase();

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


// comparar senha
UsuarioSchema.methods.compararSenha = function (senha) {
  return bcrypt.compare(senha, this.senha);
};


module.exports =
  mongoose.models.Usuario || mongoose.model("Usuario", UsuarioSchema);