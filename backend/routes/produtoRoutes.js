const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


// ===============================
// LISTAR PRODUTOS DA LOJA LOGADA
// ===============================
router.get("/", auth, async (req, res) => {
  try {
    const produtos = await Produto.find({
      lojaId: req.user.lojaId,
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

    const existe = await Produto.findOne({
      nome,
      lojaId: req.user.lojaId
    });

    if (existe) {
      return res.status(400).json({
        erro: "Produto já cadastrado nesta loja"
      });
    }

    const produto = await Produto.create({
      nome,
      preco: Number(preco),
      custo: Number(custo),
      estoque: Number(estoque) || 0,
      categoria: categoria || "geral",
      ativo: true,
      lojaId: req.user.lojaId
    });

    res.status(201).json(produto);

  } catch (err) {
    console.log("ERRO CRIAR PRODUTO:", err);

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
    const produto = await Produto.findOne({
      _id: req.params.id,
      lojaId: req.user.lojaId
    });

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    const {
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
    const produto = await Produto.findOne({
      _id: req.params.id,
      lojaId: req.user.lojaId
    });

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

    const produto = await Produto.findOne({
      _id: req.params.id,
      lojaId: req.user.lojaId
    });

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