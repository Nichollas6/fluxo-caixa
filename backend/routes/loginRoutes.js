const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";


// LOGIN
router.post("/", async (req, res) => {
  try {
    let { email, senha } = req.body;

    // limpar dados
    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    // busca usuário + senha
    const user = await Usuario
      .findOne({ email })
      .select("+senha");

    if (!user) {
      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    // usuário desativado
    if (!user.ativo) {
      return res.status(403).json({
        erro: "Usuário desativado"
      });
    }

    // validar senha
    const senhaValida = await user.compararSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    // buscar loja vinculada
    const loja = await Loja.findById(user.lojaId);

    // gerar token
    const token = jwt.sign(
      {
        id: user._id,
        tipo: user.tipo,
        lojaId: user.lojaId
      },
      SECRET,
      {
        expiresIn: "8h"
      }
    );

    // resposta
    res.json({
      token,
      user: {
        _id: user._id,
        nome: loja?.nome || "Minha Loja", // 🔥 aqui resolve
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      }
    });

  } catch (err) {
    console.log("Erro no login:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;