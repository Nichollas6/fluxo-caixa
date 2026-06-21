const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET;

router.post("/criar", async (req, res) => {
  try {
    if (!SECRET) {
      throw new Error("JWT_SECRET não configurado");
    }

    let { nome, documento, email, senha, telefone } = req.body;

    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    nome = String(nome).trim();
    documento = String(documento).replace(/\D/g, "");
    email = String(email).trim().toLowerCase();
    senha = String(senha).trim();
    telefone = telefone ? String(telefone).replace(/\D/g, "") : "";

    if (documento.length < 11 || documento.length > 14) {
      return res.status(400).json({
        erro: "Documento inválido"
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        erro: "Email inválido"
      });
    }

    const lojaExiste = await Loja.findOne({ documento });

    if (lojaExiste) {
      return res.status(400).json({
        erro: "Documento já cadastrado"
      });
    }

    const usuarioExiste = await Usuario.findOne({
      email
    });

    if (usuarioExiste) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      });
    }

    const loja = await Loja.create({
      nome,
      email,
      telefone,
      documento,
      plano: "free",
      status: "ativo"
    });

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      tipo: "admin",
      ativo: true,
      lojaId: loja._id
    });

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
    console.log("❌ ERRO CRIAR LOJA:", err.message);

    return res.status(500).json({
      erro: "Erro ao criar loja",
      detalhe: err.message
    });
  }
});

module.exports = router;