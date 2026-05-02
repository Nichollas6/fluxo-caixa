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

    console.log("BODY LOGIN:", req.body);

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

    if (!email || !senha) {

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
      }).select("+senha");

    console.log("USER:", user);

    if (!user) {

      return res.status(401).json({
        erro:
          "Usuário não encontrado"
      });
    }

    // =========================
    // USUÁRIO INATIVO
    // =========================
    if (user.ativo === false) {

      return res.status(403).json({
        erro:
          "Usuário desativado"
      });
    }

    // =========================
    // VALIDAR SENHA
    // =========================
    if (
      typeof user.compararSenha !==
      "function"
    ) {

      console.log(
        "compararSenha não existe"
      );

      return res.status(500).json({
        erro:
          "Método compararSenha não encontrado"
      });
    }

    const senhaValida =
      await user.compararSenha(
        senha
      );

    console.log(
      "SENHA VALIDA:",
      senhaValida
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

    console.log("LOJA:", loja);

    if (!loja) {

      return res.status(404).json({
        erro:
          "Loja não encontrada"
      });
    }

    // =========================
    // LOJA BLOQUEADA
    // =========================
    if (
      loja.status ===
      "bloqueado"
    ) {

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
    return res.json({

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
      "ERRO LOGIN COMPLETO:",
      err
    );

    return res.status(500).json({

      erro:
        "Erro interno no login",

      detalhe:
        err.message
    });
  }
});

module.exports = router;