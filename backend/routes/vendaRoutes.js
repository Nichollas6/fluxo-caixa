const express = require("express");
const router = express.Router();

const Produto = require("../models/Produto");
const Venda = require("../models/Venda");
const Caixa = require("../models/Caixa");

const auth = require("../middleware/auth");


// =============================
// REALIZAR VENDA
// =============================
router.post("/", auth, async (req, res) => {
  try {
    let { produtoId, cliente, qtd, vendedor } = req.body;

    const lojaId = req.user.lojaId;

    // validações
    if (!produtoId || !qtd) {
      return res.status(400).json({
        erro: "Dados incompletos"
      });
    }

    qtd = Number(qtd);

    if (qtd <= 0) {
      return res.status(400).json({
        erro: "Quantidade inválida"
      });
    }

    // buscar caixa da loja
    const caixa = await Caixa.findOne({
      lojaId,
      status: "aberto"
    });

    if (!caixa) {
      return res.status(400).json({
        erro: "Abra o caixa primeiro"
      });
    }

    // buscar produto da loja
    const produto = await Produto.findOne({
      _id: produtoId,
      lojaId
    });

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    // validar estoque
    if (produto.estoque < qtd) {
      return res.status(400).json({
        erro: "Estoque insuficiente"
      });
    }

    // baixar estoque
    produto.estoque -= qtd;
    await produto.save();

    // cálculos
    const total =
      Number(produto.preco) * qtd;

    const lucro =
      total -
      (Number(produto.custo) * qtd);

    // criar venda
    const venda = await Venda.create({
      lojaId,
      produto: produto.nome,
      cliente: cliente || "Balcão",
      vendedor: vendedor || "Sistema",
      quantidade: qtd,
      valor: total,
      lucro,
      data: new Date()
    });

    // atualizar caixa
    caixa.entradas =
      (caixa.entradas || 0) + total;

    caixa.totalVendas =
      (caixa.totalVendas || 0) + total;

    caixa.lucro =
      (caixa.lucro || 0) + lucro;

    await caixa.save();

    res.json({
      sucesso: true,
      venda
    });

  } catch (err) {
    console.log("ERRO VENDA:", err);

    res.status(500).json({
      erro: "Erro ao realizar venda"
    });
  }
});

module.exports = router;