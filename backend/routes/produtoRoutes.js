const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");

// middlewares
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


// ===============================
// LISTAR PRODUTOS
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const produtos = await Produto.find({
      ativo: true
    }).sort({ createdAt: -1 });

    res.json(produtos);

  } catch (err) {
    console.log("ERRO LISTAR PRODUTOS:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ===============================
// CRIAR PRODUTO
// ===============================
router.post("/", auth, admin, async (req, res) => {
  try {
    let { nome, preco, custo, estoque, categoria } = req.body;

    nome = nome?.trim().toLowerCase();

    console.log("BODY RECEBIDO:", req.body);
    console.log("USUÁRIO:", req.user);

    if (!nome) {
      return res.status(400).json({
        erro: "Nome obrigatório"
      });
    }

    if (preco == null || custo == null) {
      return res.status(400).json({
        erro: "Preço e custo obrigatórios"
      });
    }

    if (Number(preco) < 0 || Number(custo) < 0) {
      return res.status(400).json({
        erro: "Preço/custo inválido"
      });
    }

    if (Number(estoque) < 0) {
      return res.status(400).json({
        erro: "Estoque inválido"
      });
    }

    const existe = await Produto.findOne({ nome });

    if (existe) {
      return res.status(400).json({
        erro: "Produto já cadastrado"
      });
    }

    const produto = await Produto.create({
      nome,
      preco: Number(preco),
      custo: Number(custo),
      estoque: Number(estoque) || 0,
      categoria: categoria || "geral",
      ativo: true
    });

    res.status(201).json(produto);

  } catch (err) {
    console.log("ERRO CRIAR PRODUTO:", err);

    if (err.code === 11000) {
      return res.status(400).json({
        erro: "Produto duplicado"
      });
    }

    res.status(500).json({
      erro: err.message
    });
  }
});


// ===============================
// EDITAR PRODUTO
// ===============================
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    let {
      nome,
      preco,
      custo,
      estoque,
      categoria,
      ativo
    } = req.body;

    if (nome !== undefined) {
      produto.nome = nome.trim().toLowerCase();
    }

    if (preco !== undefined) {
      produto.preco = Number(preco);
    }

    if (custo !== undefined) {
      produto.custo = Number(custo);
    }

    if (estoque !== undefined) {
      produto.estoque = Number(estoque);
    }

    if (categoria !== undefined) {
      produto.categoria = categoria;
    }

    if (ativo !== undefined) {
      produto.ativo = ativo;
    }

    await produto.save();

    res.json(produto);

  } catch (err) {
    console.log("ERRO EDITAR PRODUTO:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ===============================
// DESATIVAR PRODUTO
// ===============================
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    produto.ativo = false;

    await produto.save();

    res.json({
      mensagem: "Produto desativado com sucesso"
    });

  } catch (err) {
    console.log("ERRO DELETE PRODUTO:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});


// ===============================
// AJUSTAR ESTOQUE
// ===============================
router.put("/:id/estoque", auth, async (req, res) => {
  try {
    const { quantidade } = req.body;

    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    produto.estoque += Number(quantidade);

    if (produto.estoque < 0) {
      produto.estoque = 0;
    }

    await produto.save();

    res.json(produto);

  } catch (err) {
    console.log("ERRO ESTOQUE:", err);

    res.status(500).json({
      erro: err.message
    });
  }
});

module.exports = router;