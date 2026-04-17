const mongoose = require("mongoose");

async function conectar() {
  try {
    await mongoose.connect("mongodb://admin:s4cX.2dM7P3yXNK@ac-mfudtgv-shard-00-00.rsmsoha.mongodb.net:27017,ac-mfudtgv-shard-00-01.rsmsoha.mongodb.net:27017,ac-mfudtgv-shard-00-02.rsmsoha.mongodb.net:27017/mkimports?ssl=true&replicaSet=atlas-eoqmky-shard-0&authSource=admin&retryWrites=true&w=majority");

    console.log("Banco conectado 🔥");
  } catch (err) {
    console.log(err);
  }
}

module.exports = conectar;