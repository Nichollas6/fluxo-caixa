const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// 🔐 LOGIN
router.post("/", async (req, res) => {
  try {
    let { email, senha } = req.body;

    // 🔧 limpar dados
    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    // 🚨 validação básica
    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    // 🔎 busca usuário pelo email
    const user = await Usuario.findOne({ email });

    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    // 🔐 valida senha
    if (user.senha !== senha) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // ✅ sucesso
    res.json({
      _id: user._id,
      email: user.email,
      tipo: user.tipo
    });

  } catch (err) {
    console.log("Erro no login:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

module.exports = router;