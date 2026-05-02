const express = require("express");

const router = express.Router();

const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");

const jwt = require("jsonwebtoken");

const SECRET =
  process.env.JWT_SECRET ||
  "segredo_super_forte";


// ============================
// LOGIN
// ============================
router.post("/", async (req, res) => {
  try {

    let {
      email,
      senha
    } = req.body;

    // =========================
    // NORMALIZA DADOS
    // =========================
    email =
      email?.trim().toLowerCase();

    senha =
      senha?.trim();

    if (
      !email ||
      !senha
    ) {

      return res.status(400).json({
        erro:
          "Preencha todos os campos"
      });
    }

    // =========================
    // BUSCA USUÁRIO
    // =========================
    const user =
      await Usuario.findOne({
        email
      })
      .select("+senha");

    if (!user) {

      return res.status(401).json({
        erro:
          "Usuário não encontrado"
      });
    }

    // =========================
    // USUÁRIO INATIVO
    // =========================
    if (!user.ativo) {

      return res.status(403).json({
        erro:
          "Usuário desativado"
      });
    }

    // =========================
    // VALIDAR SENHA
    // =========================
    const senhaValida =
      await user.compararSenha(
        senha
      );

    if (!senhaValida) {

      return res.status(401).json({
        erro:
          "Senha incorreta"
      });
    }

    // =========================
    // BUSCAR LOJA
    // =========================
    const loja =
      await Loja.findById(
        user.lojaId
      );

    if (!loja) {

      return res.status(404).json({
        erro:
          "Loja não encontrada"
      });
    }

    // =========================
    // LOJA BLOQUEADA
    // =========================
    if (loja.status === "bloqueado") {

      return res.status(403).json({
        erro:
          "Loja bloqueada"
      });
    }

    // =========================
    // TOKEN JWT
    // =========================
    const token =
      jwt.sign(

        {
          id: user._id,

          nome: user.nome,

          email: user.email,

          tipo: user.tipo,

          lojaId: loja._id
        },

        SECRET,

        {
          expiresIn: "8h"
        }
      );

    // =========================
    // RESPOSTA
    // =========================
    res.json({

      token,

      user: {

        id:
          user._id,

        nome:
          user.nome || "",

        email:
          user.email,

        tipo:
          user.tipo,

        lojaId:
          loja._id,

        loja: {

          id:
            loja._id,

          nome:
            loja.nome,

          documento:
            loja.documento,

          plano:
            loja.plano,

          status:
            loja.status
        }
      }
    });

  } catch (err) {

    console.log(
      "ERRO LOGIN:",
      err
    );

    res.status(500).json({

      erro:
        "Erro interno no login"
    });
  }
});


module.exports = router;