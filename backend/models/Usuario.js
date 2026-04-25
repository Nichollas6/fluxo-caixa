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
      required: [true, "Email é obrigatório"],
      unique: true, // email único global
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


// NORMALIZA EMAIL + HASH SENHA
UsuarioSchema.pre("save", async function (next) {
  try {
    if (this.email) {
      this.email = this.email
        .trim()
        .toLowerCase();
    }

    if (!this.isModified("senha")) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);

    this.senha = await bcrypt.hash(
      this.senha,
      salt
    );

    next();

  } catch (err) {
    next(err);
  }
});


// comparar senha
UsuarioSchema.methods.compararSenha =
  async function (senhaDigitada) {
    return await bcrypt.compare(
      senhaDigitada,
      this.senha
    );
  };


// evita duplicação no Render
module.exports =
  mongoose.models.Usuario ||
  mongoose.model("Usuario", UsuarioSchema);