const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const SECRET =
  process.env.JWT_SECRET || "dev_secret";


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
        erro: "Preencha todos os campos"
      });
    }

    const user = await Usuario.findOne({
      email
    }).select("+senha");

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

    const senhaValida =
      await bcrypt.compare(
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
      {
        expiresIn: "7d"
      }
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
// CRIAR USUÁRIO DA MESMA LOJA
// Apenas admin
// ============================
router.post("/", auth, admin, async (req, res) => {
  try {
    let {
      email,
      senha,
      tipo
    } = req.body;

    email = email?.trim().toLowerCase();

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    const existe = await Usuario.findOne({
      email
    });

    if (existe) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      });
    }

    const novoUsuario =
      await Usuario.create({
        email,
        senha,
        tipo: tipo || "vendedor",

        // loja automática do admin logado
        lojaId: req.user.lojaId
      });

    res.status(201).json({
      _id: novoUsuario._id,
      email: novoUsuario.email,
      tipo: novoUsuario.tipo,
      lojaId: novoUsuario.lojaId
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao criar usuário"
    });
  }
});


// ============================
// LISTAR USUÁRIOS DA PRÓPRIA LOJA
// ============================
router.get("/", auth, async (req, res) => {
  try {
    const usuarios =
      await Usuario.find({
        lojaId: req.user.lojaId
      }).select("-senha");

    res.json(usuarios);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao buscar usuários"
    });
  }
});


// ============================
// DESATIVAR USUÁRIO
// ============================
router.put("/:id/desativar", auth, admin, async (req, res) => {
  try {
    const usuario =
      await Usuario.findOne({
        _id: req.params.id,
        lojaId: req.user.lojaId
      });

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    usuario.ativo = false;

    await usuario.save();

    res.json({
      mensagem:
        "Usuário desativado com sucesso"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao desativar usuário"
    });
  }
});

module.exports = router;