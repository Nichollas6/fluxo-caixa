const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET =
  process.env.JWT_SECRET ||
  "segredo_super_forte";


// =========================
// CRIAR LOJA
// =========================
router.post("/criar", async (req, res) => {

  try {

    let {
      nome,
      documento,
      email,
      senha
    } = req.body;

    // =========================
    // VALIDAÇÃO
    // =========================
    if (
      !nome ||
      !documento ||
      !email ||
      !senha
    ) {

      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    // =========================
    // NORMALIZA
    // =========================
    nome = nome.trim();

    documento =
      documento.replace(/\D/g, "");

    email =
      email.trim().toLowerCase();

    senha =
      senha.trim();

    // =========================
    // VERIFICA LOJA
    // =========================
    const lojaExiste =
      await Loja.findOne({
        documento
      });

    if (lojaExiste) {

      return res.status(400).json({
        erro: "Documento já cadastrado"
      });
    }

    // =========================
    // VERIFICA EMAIL
    // =========================
    const usuarioExiste =
      await Usuario.findOne({
        email
      });

    if (usuarioExiste) {

      return res.status(400).json({
        erro: "Email já cadastrado"
      });
    }

    // =========================
    // CRIA LOJA
    // =========================
    const loja =
      await Loja.create({

        nome,

        documento,

        status: "ativo",

        plano: "free"
      });

    // =========================
    // CRIA ADMIN
    // =========================
    const usuario =
      await Usuario.create({

        nome,

        email,

        senha,

        tipo: "admin",

        ativo: true,

        lojaId: loja._id
      });

    // =========================
    // TOKEN
    // =========================
    const token =
      jwt.sign(

        {
          id: usuario._id,

          tipo: usuario.tipo,

          lojaId: loja._id
        },

        SECRET,

        {
          expiresIn: "7d"
        }
      );

    // =========================
    // RESPOSTA
    // =========================
    return res.status(201).json({

      sucesso: true,

      token,

      user: {

        id: usuario._id,

        nome: usuario.nome,

        email: usuario.email,

        tipo: usuario.tipo,

        lojaId: loja._id
      }
    });

  } catch (err) {

    console.log(
      "❌ ERRO CRIAR LOJA:",
      err
    );

    return res.status(500).json({

      erro: "Erro ao criar loja",

      detalhe: err.message
    });
  }
});

module.exports = router;