const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    let { email, senha } = req.body;

    email = String(email || "").trim().toLowerCase();
    senha = String(senha || "").trim();

    if (!email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const user = await Usuario.findOne({ email }).select("+senha");

    if (!user) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    if (!user.ativo) {
      return res.status(403).json({ erro: "Usuário desativado" });
    }

    const senhaValida = await user.compararSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha incorreta" });
    }

    const loja = await Loja.findById(user.lojaId);

    if (!loja) {
      return res.status(404).json({ erro: "Loja não encontrada" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      },
      SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId,
        loja: {
          id: loja._id,
          nome: loja.nome
        }
      }
    });

  } catch (err) {
    console.log("ERRO LOGIN:", err);

    return res.status(500).json({
      erro: "Erro interno no login",
      detalhe: err.message
    });
  }
});

module.exports = router;