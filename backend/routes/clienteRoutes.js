const express = require("express");
const router = express.Router();

const Cliente = require("../models/Cliente");
const Venda = require("../models/Venda");


// 🔍 LISTAR CLIENTES (ORDENADO POR VALOR)
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find()
      .sort({ totalGasto: -1 });

    res.json(clientes);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao buscar clientes");
  }
});


// ➕ CRIAR CLIENTE
router.post("/", async (req, res) => {
  try {
    const { nome, telefone } = req.body;

    if (!nome) {
      return res.status(400).json("Nome obrigatório");
    }

    const existe = await Cliente.findOne({ nome });

    if (existe) {
      return res.status(400).json("Cliente já existe");
    }

    const cliente = await Cliente.create({
      nome,
      telefone
    });

    res.json(cliente);

  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao criar cliente");
  }
});


// 📋 HISTÓRICO DO CLIENTE
router.get("/:id/historico", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json("Cliente não encontrado");
    }

    const vendas = await Venda.find({
      cliente: cliente.nome
    }).sort({ data: -1 });

    res.json(vendas);

  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao buscar histórico");
  }
});


// ✏️ EDITAR
router.put("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(cliente);

  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao atualizar");
  }
});


// ❌ EXCLUIR
router.delete("/:id", async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao excluir");
  }
});


// 🏆 TOP CLIENTES (RANKING)
router.get("/ranking/top", async (req, res) => {
  try {
    const top = await Cliente.find()
      .sort({ totalGasto: -1 })
      .limit(5);

    res.json(top);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ranking");
  }
});


module.exports = router;