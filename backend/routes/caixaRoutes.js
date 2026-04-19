const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");
const Venda = require("../models/Venda");

// 🔍 BUSCAR CAIXA ABERTO
router.get("/", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ status: "aberto" });
    res.json(caixa);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao buscar caixa");
  }
});

// 🟢 ABRIR CAIXA
router.post("/abrir", async (req, res) => {
  try {
    const { usuario, valor } = req.body;

    if (!valor) {
      return res.status(400).json("Informe o saldo inicial");
    }

    const existente = await Caixa.findOne({ status: "aberto" });

    if (existente) {
      return res.status(400).json("Já existe caixa aberto");
    }

    const saldoInicial = Number(valor);

    const caixa = await Caixa.create({
      abertoPor: usuario,
      saldoInicial,
      saldoAtual: saldoInicial, // 🔥 CORRETO
      entradas: 0,
      saidas: 0,
      status: "aberto"
    });

    res.json(caixa);

  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao abrir caixa");
  }
});

// 🔴 FECHAR CAIXA + RELATÓRIO
router.post("/fechar", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ status: "aberto" });

    if (!caixa) {
      return res.status(400).json("Nenhum caixa aberto");
    }

    const inicio = new Date(caixa.dataAbertura);
    const fim = new Date();

    const vendas = await Venda.find({
      data: { $gte: inicio, $lte: fim }
    });

    const totalVendas = vendas.reduce(
      (acc, v) => acc + Number(v.valor || 0),
      0
    );

    const lucro = vendas.reduce(
      (acc, v) => acc + Number(v.lucro || 0),
      0
    );

    // 🔥 ATUALIZAÇÃO CORRETA
    caixa.totalVendas = totalVendas;
    caixa.lucro = lucro;

    caixa.saldoAtual =
      Number(caixa.saldoInicial || 0) +
      totalVendas -
      Number(caixa.saidas || 0);

    caixa.status = "fechado";
    caixa.dataFechamento = fim;

    await caixa.save();

    res.json({
      caixa,
      totalVendas,
      lucro,
      quantidade: vendas.length
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao fechar caixa");
  }
});

// 📜 HISTÓRICO
router.get("/historico", async (req, res) => {
  try {
    const lista = await Caixa.find().sort({ dataAbertura: -1 });
    res.json(lista);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao buscar histórico");
  }
});

module.exports = router;