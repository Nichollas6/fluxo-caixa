const express = require("express");
const router = express.Router();

const Venda = require("../models/Venda"); // 👈 IMPORTA AQUI

router.get("/", async (req, res) => {
  try {
    const { mes } = req.query;

    let filtro = {};
    if (mes) filtro.mes = Number(mes);

    const vendas = await Venda.find(filtro);

    const resumo = {};

    vendas.forEach((v) => {
      if (!resumo[v.dia]) {
        resumo[v.dia] = {
          dia: v.dia,
          entrada: 0,
          saida: 0,
        };
      }

      resumo[v.dia].entrada += v.entrada || 0;
      resumo[v.dia].saida += v.saida || 0;
    });

    res.json(Object.values(resumo));
  } catch (err) {
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
});

module.exports = router;