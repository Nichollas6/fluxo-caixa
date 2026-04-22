const express = require("express");
const router = express.Router();
const Caixa = require("../models/Caixa");

// 🔍 VER CAIXA ABERTO (ESSENCIAL pro front)
router.get("/", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({ status: "aberto" });

    return res.json({
      caixa: caixa || null,
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message,
    });
  }
});


// 🟢 ABRIR CAIXA
router.post("/abrir", async (req, res) => {
  try {
    const caixaAberto = await Caixa.findOne({ status: "aberto" });

    if (caixaAberto) {
      return res.status(400).json({
        erro: "Já existe um caixa aberto",
      });
    }

    const caixa = await Caixa.create({
      abertoPor: req.body.usuario || "Admin",
      saldoInicial: req.body.valor || 0,
      entradas: 0,
      saidas: 0,
      totalVendas: 0,
      lucro: 0,
      status: "aberto",
    });

    return res.json({
      mensagem: "Caixa aberto com sucesso",
      caixa,
    });

  } catch (err) {
    console.log("ERRO REAL CAIXA:", err);

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
      totalVendas: caixa.totalVendas,
      lucro: caixa.lucro,
    });

  } catch (err) {
    return res.status(500).json({
      erro: err.message,
    });
  }
});

module.exports = router;