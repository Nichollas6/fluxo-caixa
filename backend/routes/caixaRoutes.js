const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");

router.post("/abrir", async (req, res) => {
  try {
    const caixaAberto = await Caixa.findOne({
      status: "aberto"
    });

    if (caixaAberto) {
      return res.status(400).json({
        erro: "Já existe um caixa aberto"
      });
    }

    const caixa = await Caixa.create({
      abertoPor: "Admin", // depois pode pegar do usuário logado
      saldoInicial: 0,
      entradas: 0,
      saidas: 0,
      totalVendas: 0,
      lucro: 0,
      status: "aberto"
    });

    res.json({
      mensagem: "Caixa aberto com sucesso",
      caixa
    });

  } catch (err) {
  console.log("ERRO REAL CAIXA:", err);

  return res.status(500).json({
    erro: err.message,
    code: err.code,
    stack: err.stack
  });

    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;