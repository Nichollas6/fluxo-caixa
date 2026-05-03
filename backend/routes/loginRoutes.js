const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "segredo_super_forte";

router.post("/", async (req, res) => {
  try {
    console.log("BODY LOGIN:", req.body);

    let { email, senha } = req.body;

    // =========================
    // NORMALIZAÇÃO FORTE
    // =========================
    const emailNormalizado = (email || "")
      .normalize("NFKC")
      .toLowerCase()
      .trim()
      .replace(/\s/g, "");

    const senhaNormalizada = (senha || "").trim();

    if (!emailNormalizado || !senhaNormalizada) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    // =========================
    // BUSCA USUÁRIO
    // =========================
    const user = await Usuario.findOne({
      email: new RegExp(`^${emailNormalizado}$`, "i")
    }).select("+senha");

    console.log("USER ENCONTRADO:", user);

    if (!user) {
      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    // =========================
    // STATUS USUÁRIO
    // =========================
    if (!user.ativo) {
      return res.status(403).json({
        erro: "Usuário desativado"
      });
    }

    if (!user.lojaId) {
      return res.status(400).json({
        erro: "Usuário sem loja vinculada"
      });
    }

    // =========================
    // VERIFICA SENHA
    // =========================
    const senhaValida = await user.compararSenha(senhaNormalizada);

    console.log("SENHA VALIDA:", senhaValida);

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    // =========================
    // BUSCA LOJA
    // =========================
    const loja = await Loja.findById(user.lojaId);

    console.log("LOJA:", loja);

    if (!loja) {
      return res.status(404).json({
        erro: "Loja não encontrada"
      });
    }

    if (loja.status === "bloqueado") {
      return res.status(403).json({
        erro: "Loja bloqueada"
      });
    }

    // =========================
    // TOKEN JWT
    // =========================
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

    // =========================
    // RESPOSTA
    // =========================
    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome || "",
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId,
        loja: {
          id: loja._id,
          nome: loja.nome,
          documento: loja.documento,
          plano: loja.plano,
          status: loja.status
        }
      }
    });

  } catch (err) {
    console.log("❌ ERRO LOGIN COMPLETO:", err);

    return res.status(500).json({
      erro: "Erro interno no login",
      detalhe: err.message
    });
  }
});

module.exports = router;