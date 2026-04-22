const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");


// 🔍 PEGAR CAIXA ATUAL (último e aberto)
router.get("/", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ status: "aberto" });

    return res.json({ caixa });

  } catch (err) {
    return res.status(500).json({ erro: err.message });
  }
});


// 🟢 ABRIR CAIXA
router.post("/abrir", async (req, res) => {
  try {
    // 🔥 impede duplicado REAL
    const caixaAberto = await Caixa.findOne({ status: "aberto" });

    if (caixaAberto) {
      return res.status(400).json({
        erro: "Já existe um caixa aberto",
      });
    }

    const caixa = await Caixa.create({
      abertoPor: req.body.abertoPor || req.body.usuario || "Admin",
      saldoInicial: Number(req.body.saldoInicial || 0),
      entradas: 0,
      saidas: 0,
      totalVendas: 0,
      lucro: 0,
      status: "aberto",
      dataAbertura: new Date(),
    });

    return res.json({
      mensagem: "Caixa aberto com sucesso",
      caixa,
    });

  } catch (err) {
    console.log("ERRO CAIXA ABRIR:", err);

    return res.status(500).json({
      erro: err.message,
    });
  }
});


// 🔴 FECHAR CAIXA
router.post("/fechar", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ status: "aberto" });

    if (!caixa) {
      return res.status(400).json({
        erro: "Nenhum caixa aberto",
      });
    }

    caixa.status = "fechado";
    caixa.dataFechamento = new Date();

    await caixa.save();

    return res.json({
      mensagem: "Caixa fechado com sucesso",
      caixa,
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message,
    });
  }
});


module.exports = router;