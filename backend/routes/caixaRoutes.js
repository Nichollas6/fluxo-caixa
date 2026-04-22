const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");

router.post("/abrir", async (req, res) => {
  try {
    // verifica se já existe caixa aberto
    const caixaAberto = await Caixa.findOne({
      status: "aberto"
    });

    if (caixaAberto) {
      return res.status(400).json({
        erro: "Já existe um caixa aberto"
      });
    }

    // cria com valor inicial automático
    const caixa = await Caixa.create({
      valorInicial: 0,
      saldoAtual: 0,
      status: "aberto",
      dataAbertura: new Date()
    });

    res.json({
      mensagem: "Caixa aberto com sucesso",
      caixa
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      erro: "Erro ao abrir caixa"
    });
  }
});

module.exports = router;