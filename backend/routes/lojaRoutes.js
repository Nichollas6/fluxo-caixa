const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

router.post("/criar", async (req, res) => {
  try {
    let { nome, documento, email, senha, telefone } = req.body;

    // =========================
    // VALIDAÇÃO
    // =========================
    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    // =========================
    // NORMALIZAÇÃO
    // =========================
    nome = String(nome).trim();
    documento = String(documento).replace(/\D/g, "");
    email = String(email).trim().toLowerCase();
    senha = String(senha).trim();
    telefone = telefone ? String(telefone).replace(/\D/g, "") : "";

    // =========================
    // VALIDA DOCUMENTO
    // =========================
    if (documento.length < 11 || documento.length > 14) {
      return res.status(400).json({ erro: "Documento inválido" });
    }

    // =========================
    // VALIDA EMAIL
    // =========================
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: "Email inválido" });
    }

    // =========================
    // DUPLICIDADE
    // =========================
    const lojaExiste = await Loja.findOne({ documento });
    if (lojaExiste) {
      return res.status(400).json({ erro: "Documento já cadastrado" });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    // =========================
    // CRIA LOJA
    // =========================
    const loja = await Loja.create({
      nome,
      email,
      telefone,
      documento,
      plano: "free",
      status: "ativo"
    });

    // =========================
    // CRIA USUÁRIO ADMIN
    // =========================
    const usuario = await Usuario.create({
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
    const token = jwt.sign(
      {
        id: usuario._id,
        nome,
        email,
        tipo: "admin",
        lojaId: loja._id
      },
      SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      sucesso: true,
      token,
      user: {
        id: usuario._id,
        nome,
        email,
        tipo: "admin",
        lojaId: loja._id
      }
    });

  } catch (err) {
    console.log("❌ ERRO CRIAR LOJA:", err);

    return res.status(500).json({
      erro: "Erro ao criar loja",
      detalhe: err.message
    });
  }
});

module.exports = router;