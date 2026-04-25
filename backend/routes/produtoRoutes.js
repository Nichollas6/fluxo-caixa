const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");

// 🔐 middlewares (evita crash se arquivo não existir)
let auth = (req, res, next) => next();
let admin = (req, res, next) => next();

try {
  auth = require("../middleware/auth");
} catch (e) {
  console.log("⚠️ middleware auth não encontrado");
}

try {
  admin = require("../middleware/admin");
} catch (e) {
  console.log("⚠️ middleware admin não encontrado");
}

// 📦 LISTAR PRODUTOS (logado)
router.get("/", auth, async (req, res) => {
  try {
    const produtos = await Produto.find({ ativo: { $ne: false } });
    res.json(produtos);
  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao listar produtos" });
  }
});

// ➕ CRIAR PRODUTO (ADMIN)
router.post("/", auth, admin, async (req, res) => {
  try {
    let { nome, preco, custo, estoque, categoria } = req.body;

    nome = nome?.trim();

    if (!nome || preco == null || custo == null) {
      return res.status(400).json({ erro: "Nome, preço e custo são obrigatórios" });
    }

    if (preco < 0 || custo < 0 || estoque < 0) {
      return res.status(400).json({ erro: "Valores inválidos" });
    }

    const existe = await Produto.findOne({ nome });

    if (existe) {
      return res.status(400).json({ erro: "Produto já existe" });
    }

    const produto = await Produto.create({
      nome,
      preco: Number(preco),
      custo: Number(custo),
      estoque: Number(estoque) || 0,
      categoria,
      ativo: true
    });

    res.json(produto);

  } catch (err) {
  console.log("ERRO REAL:", err);

  res.status(500).json({
    erro: err.message
  });
}
});

// ✏️ EDITAR (ADMIN)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    const { nome, preco, custo, estoque, categoria, ativo } = req.body;

    if (nome !== undefined) produto.nome = nome.trim();
    if (preco !== undefined) produto.preco = Number(preco);
    if (custo !== undefined) produto.custo = Number(custo);
    if (estoque !== undefined) produto.estoque = Number(estoque);
    if (categoria !== undefined) produto.categoria = categoria;
    if (ativo !== undefined) produto.ativo = ativo;

    await produto.save();

    res.json(produto);

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao atualizar produto" });
  }
});

// ❌ DESATIVAR (ADMIN)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    produto.ativo = false;
    await produto.save();

    res.json({ mensagem: "Produto desativado" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao desativar produto" });
  }
});

// 📦 ESTOQUE (logado)
router.put("/:id/estoque", auth, async (req, res) => {
  try {
    const { quantidade } = req.body;

    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    produto.estoque += Number(quantidade || 0);

    if (produto.estoque < 0) {
      produto.estoque = 0;
    }

    await produto.save();

    res.json(produto);

  } catch (err) {
    console.log(err);
    res.status(500).json({ erro: "Erro ao atualizar estoque" });
  }
});

module.exports = router;