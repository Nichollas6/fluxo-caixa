const mongoose = require("mongoose");

module.exports = mongoose.model("Cliente", {
  nome: String,
  telefone: String
});