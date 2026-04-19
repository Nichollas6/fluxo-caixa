const mongoose = require("mongoose");

const CaixaSchema = new mongoose.Schema({
  abertoPor: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["aberto", "fechado"],
    default: "aberto"
  },

  // 💰 saldo inicial do caixa
  saldoInicial: {
    type: Number,
    default: 0
  },

  // 💰 saldo atual (vai sendo atualizado)
  saldoAtual: {
    type: Number,
    default: 0
  },

  // 📊 entradas e saídas
  entradas: {
    type: Number,
    default: 0
  },

  saidas: {
    type: Number,
    default: 0
  },

  // 🧾 resumo do caixa
  totalVendas: {
    type: Number,
    default: 0
  },

  lucro: {
    type: Number,
    default: 0
  },

  // 🕒 controle de tempo
  dataAbertura: {
    type: Date,
    default: Date.now
  },

  dataFechamento: {
    type: Date,
    default: null
  }
});

// 🔥 EVITA ERRO DE RELOAD / RENDER / DUPLICAÇÃO DE MODEL
module.exports =
  mongoose.models.Caixa || mongoose.model("Caixa", CaixaSchema);