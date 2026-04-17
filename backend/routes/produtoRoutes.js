const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");

// 📦 LISTAR PRODUTOS
router.get("/", async (req, res) => {
  try {
    const dados = await Produto.find();
    res.json(dados);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao buscar produtos");
  }
});

// ➕ CRIAR PRODUTO
router.post("/", async (req, res) => {
  try {
    const { nome, preco, custo, estoque } = req.body;

    if (!nome || !preco || !estoque) {
      return res.status(400).json("Campos obrigatórios");
    }

    const novo = await Produto.create({
      nome,
      preco,
      custo,
      estoque
    });

    res.json(novo);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao criar produto");
  }
});

// ✏️ EDITAR PRODUTO
router.put("/:id", async (req, res) => {
  try {
    const produto = await Produto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    res.json(produto);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao atualizar produto");
  }
});

// 🗑 EXCLUIR PRODUTO
router.delete("/:id", async (req, res) => {
  try {
    const produto = await Produto.findByIdAndDelete(req.params.id);

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    res.json("Produto excluído");
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro ao excluir produto");
  }
});

module.exports = router;