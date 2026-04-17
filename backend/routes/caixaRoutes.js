const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");
const Venda = require("../models/Venda");

// 🔍 CAIXA ABERTO
router.get("/", async (req, res) => {
  const caixa = await Caixa.findOne({ status: "aberto" });
  res.json(caixa);
});

// 🟢 ABRIR
router.post("/abrir", async (req, res) => {
  const existente = await Caixa.findOne({ status: "aberto" });

  if (existente) {
    return res.status(400).json("Já existe caixa aberto");
  }

  const caixa = await Caixa.create({
    abertoPor: req.body.usuario,
    saldoInicial: req.body.valor,
    status: "aberto",
    dataAbertura: new Date()
  });

  res.json(caixa);
});

// 🔴 FECHAR + RELATÓRIO
router.post("/fechar", async (req, res) => {
  const caixa = await Caixa.findOne({ status: "aberto" });

  if (!caixa) {
    return res.status(400).json("Nenhum caixa aberto");
  }

  // 📊 vendas do dia
  const inicio = new Date(caixa.dataAbertura);

  const vendas = await Venda.find({
    data: { $gte: inicio }
  });

  const totalVendas = vendas.reduce((acc, v) => acc + v.valor, 0);
  const lucro = vendas.reduce((acc, v) => acc + v.lucro, 0);

  caixa.status = "fechado";
  caixa.saldoFinal = caixa.saldoInicial + totalVendas;
  caixa.dataFechamento = new Date();

  await caixa.save();

  res.json({
    caixa,
    totalVendas,
    lucro,
    quantidade: vendas.length
  });
});

module.exports = router;