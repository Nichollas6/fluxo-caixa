const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Usuario.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    if (user.senha !== senha) {
      return res.status(401).json({
        erro: "Senha inválida"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      }
    });

  } catch (err) {
    console.log("ERRO LOGIN:", err);

    return res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;