const mongoose = require("mongoose");

const VendaSchema = new mongoose.Schema(
  {
    lojaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loja",
      required: true
    },

    produto: {
      type: String,
      required: true,
      trim: true
    },

    cliente: {
      type: String,
      default: "Balcão",
      trim: true
    },

    vendedor: {
      type: String,
      default: "Sistema",
      trim: true
    },

    quantidade: {
      type: Number,
      required: true,
      min: 1
    },

    valor: {
      type: Number,
      required: true,
      min: 0
    },

    lucro: {
      type: Number,
      required: true,
      min: 0
    },

    data: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);


// evita erro no Render / hot reload
module.exports =
  mongoose.models.Venda ||
  mongoose.model("Venda", VendaSchema);