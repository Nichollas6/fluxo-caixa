const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "dev_secret";

// 🏪 CRIAR LOJA + ADMIN + AUTO LOGIN
router.post("/criar", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let { nome, documento, email, senha } = req.body;

    // 🔥 validação
    if (!nome || !documento || !email || !senha) {
      await session.abortTransaction();
      return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    // 🔥 normalização
    documento = documento.replace(/\D/g, "");
    email = email.trim().toLowerCase();

    // 🔍 verifica loja existente
    const lojaExiste = await Loja.findOne({ documento }).session(session);
    if (lojaExiste) {
      await session.abortTransaction();
      return res.status(400).json({ mensagem: "CPF/CNPJ já cadastrado" });
    }

    // 🔍 verifica usuário existente
    const usuarioExiste = await Usuario.findOne({ email }).session(session);
    if (usuarioExiste) {
      await session.abortTransaction();
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    // 🏪 cria loja
    const [loja] = await Loja.create(
      [{ nome, documento }],
      { session }
    );

    // 👤 cria admin
    const [admin] = await Usuario.create(
      [{
        email,
        senha,
        tipo: "admin",
        lojaId: loja._id
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // 🔐 GERA TOKEN (AUTO LOGIN)
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        tipo: admin.tipo,
        lojaId: loja._id
      },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      mensagem: "Loja criada com sucesso",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        tipo: admin.tipo,
        lojaId: loja._id
      }
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // 🔥 trata erro de duplicidade do Mongo
    if (err.code === 11000) {
      return res.status(400).json({ mensagem: "Dados já cadastrados" });
    }

    console.log("ERRO CRIAR LOJA:", err);
    res.status(500).json({ mensagem: "Erro ao criar loja" });
  }
});

module.exports = router;