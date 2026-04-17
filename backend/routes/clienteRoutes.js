const express = require("express");
const router = express.Router();
const Cliente = require("../models/Cliente");

router.get("/", async (req, res) => {
  const dados = await Cliente.find();
  res.json(dados);
});

router.post("/", async (req, res) => {
  const novo = await Cliente.create(req.body);
  res.json(novo);
});

module.exports = router;