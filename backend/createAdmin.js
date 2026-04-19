require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("./models/Usuario");

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Usuario.create({
      email: "admin@admin.com",
      senha: "123456",
      tipo: "admin"
    });

    console.log("✅ Admin criado");
  } catch (err) {
    console.log("Erro:", err.message);
  } finally {
    process.exit();
  }
}

run();