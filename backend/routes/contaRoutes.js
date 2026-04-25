const express = require("express");
const router = express.Router();

const Conta = require("../models/Conta");
const auth = require("../middleware/auth");


// ==========================
// LISTAR CONTAS DA LOJA
// ==========================
router.get("/", auth, async (req, res) => {
  try {
    const contas = await Conta.find({
      lojaId: req.user.lojaId
    }).sort({ data: -1 });

    res.json(contas);

  } catch (err) {
    console.log("ERRO LISTAR CONTAS:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ==========================
// CRIAR CONTA NA LOJA
// ==========================
router.post("/", auth, async (req, res) => {
  try {
    const {
      descricao,
      valor,
      tipo,
      categoria
    } = req.body;

    if (!descricao || !valor) {
      return res.status(400).json({
        erro: "Descrição e valor são obrigatórios"
      });
    }

    const novaConta = await Conta.create({
      lojaId: req.user.lojaId, // 🔥 vínculo automático
      descricao: descricao.trim(),
      valor: Number(valor),
      tipo: tipo || "saida",
      categoria: categoria || "geral"
    });

    res.status(201).json(novaConta);

  } catch (err) {
    console.log("ERRO AO CRIAR CONTA:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ==========================
// PAGAR CONTA
// ==========================
router.put("/:id", auth, async (req, res) => {
  try {
    const conta = await Conta.findOne({
      _id: req.params.id,
      lojaId: req.user.lojaId
    });

    if (!conta) {
      return res.status(404).json({
        erro: "Conta não encontrada"
      });
    }

    conta.pago = true;
    conta.dataPagamento = new Date();

    await conta.save();

    res.json({
      mensagem: "Conta paga com sucesso",
      conta
    });

  } catch (err) {
    console.log("ERRO PAGAR CONTA:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ==========================
// EXCLUIR CONTA
// ==========================
router.delete("/:id", auth, async (req, res) => {
  try {
    const conta = await Conta.findOneAndDelete({
      _id: req.params.id,
      lojaId: req.user.lojaId
    });

    if (!conta) {
      return res.status(404).json({
        erro: "Conta não encontrada"
      });
    }

    res.json({
      mensagem: "Conta removida com sucesso"
    });

  } catch (err) {
    console.log("ERRO EXCLUIR CONTA:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;