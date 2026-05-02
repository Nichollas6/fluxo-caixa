const express = require("express");

const router = express.Router();

const Produto = require("../models/Produto");
const Venda = require("../models/Venda");
const Caixa = require("../models/Caixa");
const Cliente = require("../models/Cliente");

const auth = require("../middleware/auth");


// =============================
// REALIZAR VENDA
// =============================
router.post("/", auth, async (req, res) => {
  try {

    let {
      produtoId,
      cliente,
      qtd
    } = req.body;

    const lojaId =
      req.lojaId;

    // =========================
    // VALIDAÇÕES
    // =========================
    if (
      !produtoId ||
      !qtd
    ) {

      return res.status(400).json({
        erro:
          "Dados incompletos"
      });
    }

    qtd =
      Number(qtd);

    if (
      isNaN(qtd) ||
      qtd <= 0
    ) {

      return res.status(400).json({
        erro:
          "Quantidade inválida"
      });
    }

    // =========================
    // BUSCAR CAIXA
    // =========================
    const caixa =
      await Caixa.findOne({

        lojaId,

        status: "aberto"
      });

    if (!caixa) {

      return res.status(400).json({
        erro:
          "Abra o caixa primeiro"
      });
    }

    // =========================
    // BUSCAR PRODUTO
    // =========================
    const produto =
      await Produto.findOne({

        _id:
          produtoId,

        lojaId,

        ativo: true
      });

    if (!produto) {

      return res.status(404).json({
        erro:
          "Produto não encontrado"
      });
    }

    // =========================
    // VALIDAR ESTOQUE
    // =========================
    if (
      produto.estoque < qtd
    ) {

      return res.status(400).json({
        erro:
          "Estoque insuficiente"
      });
    }

    // =========================
    // BAIXAR ESTOQUE
    // =========================
    produto.estoque -= qtd;

    await produto.save();

    // =========================
    // CÁLCULOS
    // =========================
    const total =
      Number(produto.preco) *
      qtd;

    const lucro =
      total -
      (
        Number(produto.custo) *
        qtd
      );

    // =========================
    // CLIENTE
    // =========================
    const nomeCliente =
      cliente?.trim() ||
      "Balcão";

    // =========================
    // CRIAR VENDA
    // =========================
    const venda =
      await Venda.create({

        lojaId,

        produto:
          produto.nome,

        cliente:
          nomeCliente,

        vendedor:
          req.user?.nome ||
          req.user?.email ||
          "Sistema",

        quantidade:
          qtd,

        valor:
          total,

        lucro,

        data:
          new Date()
      });

    // =========================
    // ATUALIZA CLIENTE CRM
    // =========================
    if (
      nomeCliente !== "Balcão"
    ) {

      const clienteDB =
        await Cliente.findOne({

          nome:
            nomeCliente,

          lojaId
        });

      if (clienteDB) {

        clienteDB.totalCompras += 1;

        clienteDB.totalGasto +=
          total;

        clienteDB.ultimaCompra =
          new Date();

        await clienteDB.save();
      }
    }

    // =========================
    // ATUALIZAR CAIXA
    // =========================
    caixa.entradas =
      Number(caixa.entradas || 0) +
      total;

    caixa.totalVendas =
      Number(caixa.totalVendas || 0) +
      total;

    caixa.lucro =
      Number(caixa.lucro || 0) +
      lucro;

    await caixa.save();

    // =========================
    // RESPOSTA
    // =========================
    res.json({

      sucesso: true,

      mensagem:
        "Venda realizada com sucesso",

      venda
    });

  } catch (err) {

    console.log(
      "ERRO VENDA:",
      err
    );

    res.status(500).json({

      erro:
        "Erro ao realizar venda"
    });
  }
});


module.exports = router;