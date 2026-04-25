const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET =
  process.env.JWT_SECRET || "dev_secret";


// CRIAR NOVA LOJA
router.post("/criar", async (req, res) => {
  const session =
    await mongoose.startSession();

  session.startTransaction();

  try {
    let {
      nome,
      documento,
      email,
      senha
    } = req.body;

    if (
      !nome ||
      !documento ||
      !email ||
      !senha
    ) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        mensagem:
          "Preencha todos os campos"
      });
    }

    // normalizar
    documento =
      documento.replace(/\D/g, "");

    email =
      email.trim().toLowerCase();

    // verificar loja
    const lojaExiste =
      await Loja.findOne({
        documento
      });

    if (lojaExiste) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        mensagem:
          "CPF/CNPJ já cadastrado"
      });
    }

    // verificar email global
    const usuarioExiste =
      await Usuario.findOne({
        email
      });

    if (usuarioExiste) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        mensagem:
          "Email já cadastrado"
      });
    }

    // cria loja
    const loja = await Loja.create(
      [
        {
          nome,
          documento
        }
      ],
      { session }
    );

    // cria admin
    const admin = await Usuario.create(
      [
        {
          email,
          senha,
          tipo: "admin",
          lojaId: loja[0]._id
        }
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // token
    const token = jwt.sign(
      {
        id: admin[0]._id,
        email: admin[0].email,
        tipo: admin[0].tipo,
        lojaId: loja[0]._id
      },
      SECRET,
      {
        expiresIn: "7d"
      }
    );

    return res.status(201).json({
      mensagem:
        "Loja criada com sucesso",

      token,

      user: {
        id: admin[0]._id,
        nome: loja[0].nome,
        email: admin[0].email,
        tipo: admin[0].tipo,
        lojaId: loja[0]._id
      }
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(
      "ERRO CRIAR LOJA:",
      err
    );

    return res.status(500).json({
      mensagem:
        "Erro ao criar loja"
    });
  }
});

module.exports = router;