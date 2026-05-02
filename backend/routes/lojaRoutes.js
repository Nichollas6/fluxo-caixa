const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET =
  process.env.JWT_SECRET ||
  "dev_secret";


// ===================================
// CRIAR NOVA LOJA
// ===================================
router.post("/criar", async (req, res) => {

  const session =
    await mongoose.startSession();

  try {

    session.startTransaction();

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

      await session.abortTransaction();

      return res.status(400).json({
        erro:
          "Preencha todos os campos"
      });
    }

    // =========================
    // NORMALIZAÇÃO
    // =========================
    nome =
      nome.trim();

    documento =
      documento
      .replace(/\D/g, "");

    email =
      email
      .trim()
      .toLowerCase();

    senha =
      senha.trim();

    // =========================
    // VALIDAR DOCUMENTO
    // =========================
    if (
      documento.length < 11 ||
      documento.length > 14
    ) {

      await session.abortTransaction();

      return res.status(400).json({
        erro:
          "CPF/CNPJ inválido"
      });
    }

    // =========================
    // VERIFICAR LOJA
    // =========================
    const lojaExiste =
      await Loja.findOne({
        documento
      });

    if (lojaExiste) {

      await session.abortTransaction();

      return res.status(400).json({
        erro:
          "CPF/CNPJ já cadastrado"
      });
    }

    // =========================
    // VERIFICAR EMAIL
    // =========================
    const usuarioExiste =
      await Usuario.findOne({
        email
      });

    if (usuarioExiste) {

      await session.abortTransaction();

      return res.status(400).json({
        erro:
          "Email já cadastrado"
      });
    }

    // =========================
    // CRIAR LOJA
    // =========================
    const loja =
      await Loja.create(
        [
          {
            nome,

            documento,

            email,

            status: "ativo",

            plano: "free"
          }
        ],
        {
          session
        }
      );

    // =========================
    // CRIAR ADMIN
    // =========================
    const admin =
      await Usuario.create(
        [
          {
            nome,

            email,

            senha,

            tipo: "admin",

            lojaId:
              loja[0]._id
          }
        ],
        {
          session
        }
      );

    // =========================
    // FINALIZA TRANSAÇÃO
    // =========================
    await session.commitTransaction();

    // =========================
    // TOKEN JWT
    // =========================
    const token =
      jwt.sign(

        {
          id:
            admin[0]._id,

          nome:
            admin[0].nome,

          email:
            admin[0].email,

          tipo:
            admin[0].tipo,

          lojaId:
            loja[0]._id
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

      mensagem:
        "Loja criada com sucesso",

      token,

      user: {

        id:
          admin[0]._id,

        nome:
          admin[0].nome,

        email:
          admin[0].email,

        tipo:
          admin[0].tipo,

        lojaId:
          loja[0]._id,

        loja: {

          id:
            loja[0]._id,

          nome:
            loja[0].nome,

          documento:
            loja[0].documento,

          plano:
            loja[0].plano,

          status:
            loja[0].status
        }
      }
    });

  } catch (err) {

    await session.abortTransaction();

    console.log(
      "ERRO CRIAR LOJA:",
      err
    );

    return res.status(500).json({

      erro:
        "Erro ao criar loja"
    });

  } finally {

    session.endSession();
  }
});


module.exports = router;