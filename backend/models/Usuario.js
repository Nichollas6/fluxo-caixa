const mongoose = require("mongoose");

module.exports = mongoose.model("Usuario", {
  email: String,
  senha: String,
  tipo: String
});