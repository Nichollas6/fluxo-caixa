const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/criar", async (req, res) => {
  try {
    let { nome, documento, email, senha } = req.body;

    // 🔥 validação
    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({ mensagem: "Preencha todos os campos" });
    }

    // 🔥 normalização
    documento = documento.replace(/\D/g, "");
    email = email.trim().toLowerCase();

    // 🔍 verifica duplicidade
    const lojaExiste = await Loja.findOne({ documento });
    if (lojaExiste) {
      return res.status(400).json({ mensagem: "CPF/CNPJ já cadastrado" });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ mensagem: "Email já cadastrado" });
    }

    // 🏪 cria loja
    const loja = await Loja.create({ nome, documento });

    // 👤 cria admin
    const admin = await Usuario.create({
      email,
      senha,
      tipo: "admin",
      lojaId: loja._id
    });

    // 🔐 token (auto login)
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
    console.log("ERRO CRIAR LOJA:", err);

    if (err.code === 11000) {
      return res.status(400).json({ mensagem: "Dados já cadastrados" });
    }

    res.status(500).json({ mensagem: "Erro ao criar loja" });
  }
});

module.exports = router;