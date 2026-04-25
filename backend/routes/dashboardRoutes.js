const express = require("express");
const router = express.Router();

const Venda = require("../models/Venda");
const Conta = require("../models/Conta");
const Caixa = require("../models/Caixa");

router.get("/", async (req, res) => {
  try {
    // vendas
    const vendas = await Venda.find();

    const totalVendas = vendas.reduce(
      (acc, item) => acc + Number(item.valor || 0),
      0
    );

    const totalLucro = vendas.reduce(
      (acc, item) => acc + Number(item.lucro || 0),
      0
    );

    // contas pagas = saídas
    const contasPagas = await Conta.find({
      pago: true
    });

    const totalSaidas = contasPagas.reduce(
      (acc, item) => acc + Number(item.valor || 0),
      0
    );

    // caixa aberto
    const caixa = await Caixa.findOne({
      status: "aberto"
    });

    res.json({
      vendas: totalVendas,
      lucro: totalLucro,
      saidas: totalSaidas,
      caixaAtual: caixa?.saldoAtual || 0,
      contasPagas
    });

  } catch (err) {
    console.log("ERRO DASHBOARD:", err);

    res.status(500).json({
      erro: "Erro ao carregar dashboard"
    });
  }
});

module.exports = router;