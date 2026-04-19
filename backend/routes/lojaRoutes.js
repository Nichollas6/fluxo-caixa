const express = require("express");
const router = express.Router();

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

// 🏪 CRIAR LOJA + ADMIN
router.post("/criar", async (req, res) => {
  try {
    let { nome, documento, email, senha } = req.body;

    documento = documento?.replace(/\D/g, "");

    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const existe = await Loja.findOne({ documento });

    if (existe) {
      return res.status(400).json({ erro: "CPF/CNPJ já existe" });
    }

    const loja = await Loja.create({
      nome,
      documento
    });

    const admin = await Usuario.create({
      email,
      senha,
      tipo: "admin",
      lojaId: loja._id
    });

    res.json({ loja, admin });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao criar loja" });
  }
});

module.exports = router;