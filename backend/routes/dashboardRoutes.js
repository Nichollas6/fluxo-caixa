const express = require("express");

const router = express.Router();

const Venda = require("../models/Venda");
const Conta = require("../models/Conta");

const auth = require("../middleware/auth");


// ================================
// DASHBOARD MULTI LOJA
// ================================
router.get("/", auth, async (req, res) => {
  try {

    const { mes } = req.query;

    // =========================
    // FILTROS
    // =========================
    let filtroVendas = {
      lojaId: req.lojaId
    };

    let filtroContas = {
      lojaId: req.lojaId,
      pago: true
    };

    // =========================
    // FILTRO POR MÊS
    // =========================
    if (mes) {

      const anoAtual =
        new Date().getFullYear();

      const inicio =
        new Date(
          anoAtual,
          Number(mes) - 1,
          1
        );

      const fim =
        new Date(
          anoAtual,
          Number(mes),
          0,
          23,
          59,
          59
        );

      filtroVendas.data = {
        $gte: inicio,
        $lte: fim
      };

      filtroContas.dataPagamento = {
        $gte: inicio,
        $lte: fim
      };
    }

    // =========================
    // BUSCAR DADOS
    // =========================
    const vendas =
      await Venda.find(filtroVendas);

    const contas =
      await Conta.find(filtroContas);

    const resumo = {};

    // =========================
    // ENTRADAS
    // =========================
    vendas.forEach((venda) => {

      const dia =
        new Date(venda.data)
        .getDate();

      if (!resumo[dia]) {

        resumo[dia] = {
          dia,
          entrada: 0,
          saida: 0,
          lucro: 0
        };
      }

      resumo[dia].entrada +=
        Number(venda.valor || 0);

      resumo[dia].lucro +=
        Number(venda.lucro || 0);
    });

    // =========================
    // SAÍDAS
    // =========================
    contas.forEach((conta) => {

      const dataConta =
        conta.dataPagamento ||
        conta.data;

      const dia =
        new Date(dataConta)
        .getDate();

      if (!resumo[dia]) {

        resumo[dia] = {
          dia,
          entrada: 0,
          saida: 0,
          lucro: 0
        };
      }

      resumo[dia].saida +=
        Number(conta.valor || 0);
    });

    // =========================
    // ORDENA GRÁFICO
    // =========================
    const resultado =
      Object.values(resumo)
      .sort((a, b) =>
        a.dia - b.dia
      );

    // =========================
    // TOTAIS
    // =========================
    const totalEntradas =
      vendas.reduce(

        (acc, item) =>

          acc +
          Number(item.valor || 0),

        0
      );

    const totalSaidas =
      contas.reduce(

        (acc, item) =>

          acc +
          Number(item.valor || 0),

        0
      );

    const totalLucro =
      vendas.reduce(

        (acc, item) =>

          acc +
          Number(item.lucro || 0),

        0
      );

    const saldoFinal =
      totalEntradas -
      totalSaidas;

    // =========================
    // RESPOSTA
    // =========================
    res.json({

      grafico: resultado,

      resumo: {

        entradas:
          totalEntradas,

        saidas:
          totalSaidas,

        lucro:
          totalLucro,

        saldo:
          saldoFinal
      }
    });

  } catch (err) {

    console.log(
      "ERRO DASHBOARD:",
      err
    );

    res.status(500).json({

      erro:
        "Erro ao carregar dashboard"
    });
  }
});


module.exports = router;