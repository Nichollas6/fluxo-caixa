const express = require("express");
const router = express.Router();
const Conta = require("../models/Conta");


// LISTAR CONTAS
router.get("/", async (req, res) => {
  try {
    const contas = await Conta.find().sort({ data: -1 });
    res.json(contas);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      erro: "Erro ao listar contas"
    });
  }
});


// CRIAR CONTA
router.post("/", async (req, res) => {
  try {
    const { descricao, valor, tipo, categoria } = req.body;

    if (!descricao || !valor) {
      return res.status(400).json({
        erro: "Descrição e valor são obrigatórios"
      });
    }

    const novaConta = await Conta.create({
      descricao,
      valor: Number(valor),
      tipo: tipo || "saida",
      categoria: categoria || "geral"
    });

    res.json(novaConta);

  } catch (err) {
    console.log("ERRO AO CRIAR CONTA:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// PAGAR CONTA
router.put("/:id", async (req, res) => {
  try {
    const conta = await Conta.findById(req.params.id);

    if (!conta) {
      return res.status(404).json({
        erro: "Conta não encontrada"
      });
    }

    conta.pago = true;
    conta.dataPagamento = new Date();

    await conta.save();

    res.json(conta);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      erro: "Erro ao pagar conta"
    });
  }
});

module.exports = router;