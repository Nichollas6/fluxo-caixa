const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

const SECRET = "segredo_super_forte";

// 🔐 LOGIN
router.post("/", async (req, res) => {
  try {
    let { email, senha } = req.body;

    // 🔧 limpar dados
    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    // 🔎 buscar usuário + senha
    const user = await Usuario.findOne({ email }).select("+senha");

    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    // 🚫 usuário desativado
    if (!user.ativo) {
      return res.status(403).json({ erro: "Usuário desativado" });
    }

    // 🔐 validar senha (usando método do model)
    const senhaValida = await user.compararSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    // 🔥 gerar token
    const token = jwt.sign(
      { id: user._id, tipo: user.tipo },
      SECRET,
      { expiresIn: "8h" }
    );

    // ✅ resposta limpa
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        tipo: user.tipo
      }
    });

  } catch (err) {
    console.log("Erro no login:", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

module.exports = router;