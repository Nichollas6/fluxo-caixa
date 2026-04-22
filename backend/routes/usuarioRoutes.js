const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev_secret";


// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {
    let { email, senha } = req.body;

    email = email?.trim().toLowerCase();
    senha = senha?.trim();

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha os campos"
      });
    }

    const user = await Usuario.findOne({ email })
      .select("+senha");

    if (!user) {
      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    if (!user.ativo) {
      return res.status(403).json({
        erro: "Usuário desativado"
      });
    }

    const senhaValida = await bcrypt.compare(
      senha,
      user.senha
    );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        tipo: user.tipo,
        lojaId: user.lojaId
      },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro no login"
    });
  }
});


// ============================
// CRIAR USUÁRIO
// ============================
router.post("/", async (req, res) => {
  try {
    let {
      email,
      senha,
      tipo,
      lojaId
    } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !senha || !lojaId) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    const existe = await Usuario.findOne({ email });

    if (existe) {
      return res.status(400).json({
        erro: "Usuário já existe"
      });
    }

    const novo = await Usuario.create({
      email,
      senha,
      tipo: tipo || "vendedor",
      lojaId
    });

    res.json({
      _id: novo._id,
      email: novo.email,
      tipo: novo.tipo,
      lojaId: novo.lojaId
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao criar usuário"
    });
  }
});


// ============================
// LISTAR USUÁRIOS DA LOJA
// ============================
router.get("/:lojaId", async (req, res) => {
  try {
    const usuarios = await Usuario.find({
      lojaId: req.params.lojaId
    });

    res.json(usuarios);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao buscar usuários"
    });
  }
});

module.exports = router;