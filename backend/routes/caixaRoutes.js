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

    const caixa = await Caixa.create({
      abertoPor: usuario,
      saldoInicial: Number(valor),
      saldoFinal: 0,
      status: "aberto",
      dataAbertura: new Date()
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

    // 🔥 intervalo do caixa
    const inicio = new Date(caixa.dataAbertura);
    const fim = new Date();

    // 📊 vendas do período
    const vendas = await Venda.find({
      data: { $gte: inicio, $lte: fim }
    });

    // 💰 cálculos seguros (COM ??)
    const totalVendas = vendas.reduce(
      (acc, v) => acc + Number(v.valor ?? 0),
      0
    );

    const lucro = vendas.reduce(
      (acc, v) => acc + Number(v.lucro ?? 0),
      0
    );

    // 🧾 atualização do caixa
    caixa.totalVendas = totalVendas;
    caixa.lucro = lucro;
    caixa.saldoFinal = Number(caixa.saldoInicial ?? 0) + totalVendas;

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


// 📜 HISTÓRICO DE CAIXAS
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