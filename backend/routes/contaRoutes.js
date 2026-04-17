const express = require("express");
const router = express.Router();
const Conta = require("../models/Conta");

router.get("/", async (req, res) => {
  res.json(await Conta.find());
});

router.post("/", async (req, res) => {
  res.json(await Conta.create({
    ...req.body,
    pago: false,
    data: new Date()
  }));
});

router.put("/:id", async (req, res) => {
  await Conta.findByIdAndUpdate(req.params.id, { pago: true });
  res.json("Conta paga");
});

module.exports = router;