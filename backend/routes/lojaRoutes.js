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
      senha,
      telefone
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
    // NORMALIZAÇÃO
    // =========================
    nome =
      String(nome).trim();

    documento =
      String(documento)
      .replace(/\D/g, "");

    email =
      String(email)
      .trim()
      .toLowerCase();

    senha =
      String(senha).trim();

    telefone =
      telefone
        ? String(telefone)
            .replace(/\D/g, "")
        : "";

    // =========================
    // VALIDAR DOCUMENTO
    // =========================
    if (
      documento.length < 11 ||
      documento.length > 14
    ) {

      return res.status(400).json({
        erro: "Documento inválido"
      });
    }

    // =========================
    // VALIDAR EMAIL
    // =========================
    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(email)) {

      return res.status(400).json({
        erro: "Email inválido"
      });
    }

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

        email,

        telefone,

        documento,

        plano: "free",

        status: "ativo"
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

          nome: usuario.nome,

          email: usuario.email,

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

      mensagem:
        "Loja criada com sucesso",

      token,

      user: {

        id:
          usuario._id,

        nome:
          usuario.nome,

        email:
          usuario.email,

        tipo:
          usuario.tipo,

        lojaId:
          loja._id,

        loja: {

          id:
            loja._id,

          nome:
            loja.nome,

          email:
            loja.email,

          telefone:
            loja.telefone,

          documento:
            loja.documento,

          plano:
            loja.plano,

          status:
            loja.status
        }
      }
    });

  } catch (err) {

    console.log(
      "❌ ERRO CRIAR LOJA:"
    );

    console.log(err);

    return res.status(500).json({

      erro:
        "Erro ao criar loja",

      detalhe:
        err.message
    });
  }
});

module.exports = router;