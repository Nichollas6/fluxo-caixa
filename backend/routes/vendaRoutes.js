const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const Venda = require("../models/Venda");
const Caixa = require("../models/Caixa");

router.post("/", async (req, res) => {
  try {
    const { produtoId, cliente, qtd, vendedor } = req.body;

    // 🔐 BLOQUEAR VENDA SEM CAIXA
    const caixa = await Caixa.findOne({ status: "aberto" });

    if (!caixa) {
      return res.status(400).json("Abra o caixa primeiro");
    }

    // 🔎 BUSCAR PRODUTO
    const produto = await Produto.findById(produtoId);

    if (!produto) {
      return res.status(404).json("Produto não encontrado");
    }

    // 📦 VALIDAR ESTOQUE
    if (produto.estoque < qtd) {
      return res.status(400).json("Estoque insuficiente");
    }

    // 📉 BAIXAR ESTOQUE
    produto.estoque -= qtd;
    await produto.save();

    // 💰 CALCULAR
    const total = produto.preco * qtd;
    const lucro = total - (produto.custo * qtd);

    // 🛒 CRIAR VENDA
    const venda = await Venda.create({
      produto: produto.nome,
      cliente: cliente || "Balcão",
      vendedor,
      quantidade: qtd,
      valor: total,
      lucro,
      data: new Date()
    });

    res.json(venda);

  } catch (err) {
    console.log("ERRO VENDA:", err);
    res.status(500).json("Erro ao realizar venda");
  }
});

module.exports = router;