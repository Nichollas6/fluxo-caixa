const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");


// 🔐 LOGIN SEGURO
router.post("/login", async (req, res) => {
  try {
    let { email, senha } = req.body;

    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha os campos" });
    }

    // 🔥 IMPORTANTE AQUI
    const user = await Usuario.findOne({ email }).select("+senha");

    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    if (!user.ativo) {
      return res.status(403).json({ erro: "Usuário desativado" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    res.json({
      _id: user._id,
      email: user.email,
      tipo: user.tipo
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro no login" });
  }
});


// ➕ CRIAR USUÁRIO
router.post("/", async (req, res) => {
  try {
    let { email, senha, tipo } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha os campos" });
    }

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const hash = await bcrypt.hash(senha, 10);

    const novo = await Usuario.create({
      email,
      senha: hash,
      tipo: tipo || "vendedor"
    });

    res.json({
      _id: novo._id,
      email: novo.email,
      tipo: novo.tipo
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao criar usuário" });
  }
});


// 📋 LISTAR
router.get("/", async (req, res) => {
  try {
    const users = await Usuario.find(); // senha já não vem
    res.json(users);
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar usuários" });
  }
});

module.exports = router;