const express = require("express");

const router = express.Router();

const Cliente = require("../models/Cliente");
const Venda = require("../models/Venda");

const auth = require("../middleware/auth");


// ============================
// LISTAR CLIENTES
// ============================
router.get("/", auth, async (req, res) => {
  try {

    const clientes =
      await Cliente.find({
        lojaId: req.lojaId
      })
      .sort({
        totalGasto: -1
      });

    res.json(clientes);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao buscar clientes"
    });
  }
});


// ============================
// CRIAR CLIENTE
// ============================
router.post("/", auth, async (req, res) => {
  try {

    let {
      nome,
      telefone
    } = req.body;

    nome = nome?.trim();

    if (!nome) {

      return res.status(400).json({
        erro: "Nome obrigatório"
      });
    }

    // verifica duplicado na mesma loja
    const existe =
      await Cliente.findOne({

        nome,

        lojaId: req.lojaId
      });

    if (existe) {

      return res.status(400).json({
        erro: "Cliente já existe"
      });
    }

    const cliente =
      await Cliente.create({

        lojaId: req.lojaId,

        nome,

        telefone:
          telefone || ""
      });

    res.json(cliente);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao criar cliente"
    });
  }
});


// ============================
// HISTÓRICO CLIENTE
// ============================
router.get("/:id/historico", auth, async (req, res) => {
  try {

    const cliente =
      await Cliente.findOne({

        _id: req.params.id,

        lojaId: req.lojaId
      });

    if (!cliente) {

      return res.status(404).json({
        erro: "Cliente não encontrado"
      });
    }

    const vendas =
      await Venda.find({

        cliente: cliente.nome,

        lojaId: req.lojaId
      })
      .sort({
        data: -1
      });

    res.json(vendas);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao buscar histórico"
    });
  }
});


// ============================
// EDITAR CLIENTE
// ============================
router.put("/:id", auth, async (req, res) => {
  try {

    const cliente =
      await Cliente.findOneAndUpdate(

        {
          _id: req.params.id,

          lojaId: req.lojaId
        },

        req.body,

        {
          new: true
        }
      );

    if (!cliente) {

      return res.status(404).json({
        erro: "Cliente não encontrado"
      });
    }

    res.json(cliente);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao atualizar cliente"
    });
  }
});


// ============================
// EXCLUIR CLIENTE
// ============================
router.delete("/:id", auth, async (req, res) => {
  try {

    const cliente =
      await Cliente.findOneAndDelete({

        _id: req.params.id,

        lojaId: req.lojaId
      });

    if (!cliente) {

      return res.status(404).json({
        erro: "Cliente não encontrado"
      });
    }

    res.json({
      mensagem:
        "Cliente removido com sucesso"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao excluir cliente"
    });
  }
});


// ============================
// TOP CLIENTES
// ============================
router.get("/ranking/top", auth, async (req, res) => {
  try {

    const top =
      await Cliente.find({

        lojaId: req.lojaId
      })
      .sort({
        totalGasto: -1
      })
      .limit(5);

    res.json(top);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      erro: "Erro ao buscar ranking"
    });
  }
});


module.exports = router;