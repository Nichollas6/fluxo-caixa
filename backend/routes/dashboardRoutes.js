const express = require("express");
const router = express.Router();

const Venda = require("../models/Venda");
const Conta = require("../models/Conta");

router.get("/", async (req, res) => {
  try {
    const { mes } = req.query;

    let filtroVendas = {};
    let filtroContas = {};

    if (mes) {
      const ano = new Date().getFullYear();

      const inicio = new Date(ano, mes - 1, 1);
      const fim = new Date(ano, mes, 0, 23, 59, 59);

      filtroVendas.data = {
        $gte: inicio,
        $lte: fim
      };

      filtroContas.dataPagamento = {
        $gte: inicio,
        $lte: fim
      };
    }

    // vendas
    const vendas = await Venda.find(filtroVendas);

    // contas pagas = saídas
    const contas = await Conta.find({
      ...filtroContas,
      pago: true
    });

    const resumo = {};

    // entradas + lucro
    vendas.forEach((v) => {
      const dia = new Date(v.data).getDate();

      if (!resumo[dia]) {
        resumo[dia] = {
          dia,
          entrada: 0,
          saida: 0,
          lucro: 0
        };
      }

      resumo[dia].entrada += Number(v.valor || 0);
      resumo[dia].lucro += Number(v.lucro || 0);
    });

    // saídas
    contas.forEach((c) => {
      const dia = new Date(c.dataPagamento).getDate();

      if (!resumo[dia]) {
        resumo[dia] = {
          dia,
          entrada: 0,
          saida: 0,
          lucro: 0
        };
      }

      resumo[dia].saida += Number(c.valor || 0);
    });

    res.json(
      Object.values(resumo).sort((a, b) => a.dia - b.dia)
    );

  } catch (err) {
    console.log("ERRO DASHBOARD:", err);

    res.status(500).json({
      erro: "Erro ao carregar dashboard"
    });
  }
});

module.exports = router;