const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

// 🏪 CRIAR LOJA + ADMIN (COM TRANSAÇÃO)
router.post("/criar", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    let { nome, documento, email, senha } = req.body;

    // 🔥 validação básica
    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    // 🔥 normalização
    documento = documento.replace(/\D/g, "");
    email = email.trim().toLowerCase();

    // 🔍 verifica loja
    const lojaExiste = await Loja.findOne({ documento }).session(session);
    if (lojaExiste) {
      await session.abortTransaction();
      return res.status(400).json({ mensagem: "CPF/CNPJ já existe" });
    }

    // 🔍 verifica usuário
    const usuarioExiste = await Usuario.findOne({ email }).session(session);
    if (usuarioExiste) {
      await session.abortTransaction();
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    // 🏪 cria loja
    const loja = await Loja.create(
      [{ nome, documento }],
      { session }
    );

    // 👤 cria admin
    const admin = await Usuario.create(
      [{
        email,
        senha,
        tipo: "admin",
        lojaId: loja[0]._id
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      loja: loja[0],
      admin: {
        _id: admin[0]._id,
        email: admin[0].email,
        tipo: admin[0].tipo
      }
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.log(err);
    res.status(500).json({ mensagem: "Erro ao criar loja" });
  }
});

module.exports = router;