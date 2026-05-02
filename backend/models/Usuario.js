const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      trim: true,
      default: ""
    },

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

    ativo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// índice correto (evita bug de produção)
UsuarioSchema.index({ email: 1 }, { unique: true });


// 🔐 HASH SENHA
UsuarioSchema.pre("save", async function (next) {
  try {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }

    if (!this.isModified("senha")) return next();

    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);

    next();
  } catch (err) {
    next(err);
  }
});

// 🔐 UPDATE SAFE (IMPORTANTE)
UsuarioSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const update = this.getUpdate();

    if (update?.senha) {
      const salt = await bcrypt.genSalt(10);
      update.senha = await bcrypt.hash(update.senha, salt);
    }

    next();
  } catch (err) {
    next(err);
  }
});

// comparar senha
UsuarioSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports =
  mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);