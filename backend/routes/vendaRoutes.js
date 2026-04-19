const express = require("express");
const router = express.Router();
const Produto = require("../models/Produto");
const Venda = require("../models/Venda");
const Caixa = require("../models/Caixa");

router.post("/", async (req, res) => {
  try {
    let { produtoId, cliente, qtd, vendedor } = req.body;

    // 🔥 validações
    if (!produtoId || !qtd) {
      return res.status(400).json({ erro: "Dados incompletos" });
    }

    qtd = Number(qtd);

    if (qtd <= 0) {
      return res.status(400).json({ erro: "Quantidade inválida" });
    }

    // 🔐 BLOQUEAR VENDA SEM CAIXA
    const caixa = await Caixa.findOne({ status: "aberto" });

    if (!caixa) {
      return res.status(400).json({ erro: "Abra o caixa primeiro" });
    }

    // 🔎 BUSCAR PRODUTO
    const produto = await Produto.findById(produtoId);

    if (!produto) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // 📦 VALIDAR ESTOQUE
    if (produto.estoque < qtd) {
      return res.status(400).json({ erro: "Estoque insuficiente" });
    }

    // 📉 BAIXAR ESTOQUE
    produto.estoque -= qtd;
    await produto.save();

    // 💰 CALCULAR
    const total = Number(produto.preco) * qtd;
    const lucro = total - (Number(produto.custo) * qtd);

    // 🛒 CRIAR VENDA
    const venda = await Venda.create({
      produto: produto.nome,
      cliente: cliente || "Balcão",
      vendedor: vendedor || "Sistema",
      quantidade: qtd,
      valor: total,
      lucro,
      data: new Date()
    });

    // 🔥 ATUALIZAR CAIXA (NÍVEL PROFISSIONAL)
    caixa.totalVendas = (caixa.totalVendas || 0) + total;
    caixa.lucro = (caixa.lucro || 0) + lucro;

    await caixa.save();

    // 📤 retorno completo (pra recibo)
    res.json({
      sucesso: true,
      venda
    });

  } catch (err) {
    console.log("ERRO VENDA:", err);
    res.status(500).json({ erro: "Erro ao realizar venda" });
  }
});

module.exports = router;