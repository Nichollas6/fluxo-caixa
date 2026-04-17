const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await Usuario.findOne(req.body);

    if (!user) {
      return res.status(401).json("Login inválido");
    }

    res.json(user);
  } catch (err) {
    res.status(500).json("Erro no login");
  }
});

// ➕ CRIAR USUÁRIO
router.post("/", async (req, res) => {
  try {
    const { email, senha, tipo } = req.body;

    if (!email || !senha) {
      return res.status(400).json("Preencha os campos");
    }

    const novo = await Usuario.create({
      email,
      senha,
      tipo
    });

    res.json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao criar usuário");
  }
});

// 📋 LISTAR
router.get("/", async (req, res) => {
  const users = await Usuario.find();
  res.json(users);
});

module.exports = router;