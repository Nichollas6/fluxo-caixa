const express = require("express");
const router = express.Router();
const Usuario = require("../models/Usuario");

// 🔐 LOGIN
router.post("/", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await Usuario.findOne({ email, senha });

    if (!user) {
      return res.status(401).json({ erro: "Login inválido" });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json("Erro no servidor");
  }
});

module.exports = router;