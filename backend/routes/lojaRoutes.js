const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Loja = require("../models/Loja");
const Usuario = require("../models/Usuario");

const SECRET = process.env.JWT_SECRET || "dev_secret";

router.post("/criar", async (req, res) => {
  try {
    let { nome, documento, email, senha } = req.body;

    console.log("BODY RECEBIDO:", req.body);

    // validação
    if (!nome || !documento || !email || !senha) {
      return res.status(400).json({
        mensagem: "Preencha todos os campos"
      });
    }

    // normalização
    documento = documento.replace(/\D/g, "");
    email = email.trim().toLowerCase();

    console.log("Documento normalizado:", documento);
    console.log("Email normalizado:", email);

    // verifica loja existente
    const lojaExiste = await Loja.findOne({ documento });

    if (lojaExiste) {
      return res.status(400).json({
        mensagem: "CPF/CNPJ já cadastrado"
      });
    }

    // verifica usuário existente
    const usuarioExiste = await Usuario.findOne({ email });

    if (usuarioExiste) {
      return res.status(400).json({
        mensagem: "Email já cadastrado"
      });
    }

    // cria loja
    const loja = await Loja.create({
      nome,
      documento
    });

    console.log("LOJA CRIADA:", loja);

    // cria usuário admin
    const admin = await Usuario.create({
      email,
      senha,
      tipo: "admin",
      lojaId: loja._id
    });

    console.log("ADMIN CRIADO:", admin);

    // gera token
    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        tipo: admin.tipo,
        lojaId: loja._id
      },
      SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      mensagem: "Loja criada com sucesso",
      token,
      user: {
        id: admin._id,
        email: admin.email,
        tipo: admin.tipo,
        lojaId: loja._id
      }
    });

  } catch (err) {
    console.log("ERRO REAL:", err);

    return res.status(500).json({
      mensagem: err.message,
      stack: err.stack
    });
  }
});

module.exports = router;