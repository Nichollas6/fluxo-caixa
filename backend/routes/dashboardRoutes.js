const express = require("express");
const router = express.Router();

const Venda = require("../models/Venda");

router.get("/", async (req, res) => {
  try {
    const { mes } = req.query;

    let filtro = {};

    if (mes) {
      const ano = new Date().getFullYear();

      const inicio = new Date(ano, mes - 1, 1);
      const fim = new Date(ano, mes, 0, 23, 59, 59);

      filtro.data = { $gte: inicio, $lte: fim };
    }

    const vendas = await Venda.find(filtro);

    const resumo = {};

    vendas.forEach((v) => {
      const dia = new Date(v.data).getDate();

      if (!resumo[dia]) {
        resumo[dia] = {
          dia,
          entrada: 0,
          lucro: 0
        };
      }

      resumo[dia].entrada += Number(v.valor || 0);
      resumo[dia].lucro += Number(v.lucro || 0);
    });

    res.json(Object.values(resumo));

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

module.exports = router;