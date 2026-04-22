const express = require("express");
const router = express.Router();

const Caixa = require("../models/Caixa");


// =============================
// ABRIR CAIXA
// =============================
router.post("/abrir", async (req, res) => {
  try {
    const { abertoPor, saldoInicial } = req.body;

    // validação
    if (!abertoPor) {
      return res.status(400).json({
        mensagem: "Informe quem está abrindo o caixa"
      });
    }

    // verifica se já existe caixa aberto
    const caixaAberto = await Caixa.findOne({
      status: "aberto"
    });

    if (caixaAberto) {
      return res.status(400).json({
        mensagem: "Já existe um caixa aberto"
      });
    }

    const novoCaixa = await Caixa.create({
      abertoPor,
      saldoInicial: Number(saldoInicial) || 0,
      saldoAtual: Number(saldoInicial) || 0,
      status: "aberto"
    });

    res.status(201).json({
      mensagem: "Caixa aberto com sucesso",
      caixa: novoCaixa
    });

  } catch (err) {
    console.log("ERRO ABRIR CAIXA:", err);

    res.status(500).json({
      mensagem: err.message
    });
  }
});


// =============================
// BUSCAR CAIXA ABERTO
// =============================
router.get("/", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({
      status: "aberto"
    });

    res.json(caixa);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      mensagem: err.message
    });
  }
});


// =============================
// FECHAR CAIXA
// =============================
router.post("/fechar", async (req, res) => {
  try {
    const caixa = await Caixa.findOne({
      status: "aberto"
    });

    if (!caixa) {
      return res.status(400).json({
        mensagem: "Nenhum caixa aberto"
      });
    }

    caixa.status = "fechado";
    caixa.dataFechamento = new Date();

    await caixa.save();

    res.json({
      mensagem: "Caixa fechado com sucesso",
      caixa
    });

  } catch (err) {
    console.log("ERRO FECHAR CAIXA:", err);

    res.status(500).json({
      mensagem: err.message
    });
  }
});

module.exports = router;