const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

router.post("/criar", async (req, res) => {
  try {
    let { nome, documento, email, senha, telefone } = req.body;

    // validação
    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    // normalização
    nome = String(nome).trim();
    documento = String(documento).replace(/\D/g, "");
    email = String(email).trim().toLowerCase();
    senha = String(senha).trim();
    telefone = telefone ? String(telefone).replace(/\D/g, "") : "";

    // valida documento
    if (documento.length < 11 || documento.length > 14) {
      return res.status(400).json({ erro: "Documento inválido" });
    }

    // valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ erro: "Email inválido" });
    }

    // evita duplicidade REAL (case-safe)
    const lojaExiste = await Loja.findOne({ documento });
    if (lojaExiste) {
      return res.status(400).json({ erro: "Documento já cadastrado" });
    }

    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    // cria loja
    const loja = await Loja.create({
      nome,
      email,
      telefone,
      documento,
      plano: "free",
      status: "ativo"
    });

    // cria usuário admin
    const usuario = await Usuario.create({
      nome,
      email,
      senha,
      tipo: "admin",
      ativo: true,
      lojaId: loja._id
    });

    // token
    const token = jwt.sign(
      {
        id: usuario._id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
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
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
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