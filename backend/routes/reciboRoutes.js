const express = require("express");

const router = express.Router();

const Venda = require("../models/Venda");

const auth = require("../middleware/auth");


// ===================================
// BUSCAR RECIBO DA VENDA
// ===================================
router.get("/:id", auth, async (req, res) => {
  try {

    const venda =
      await Venda.findOne({

        _id: req.params.id,

        lojaId: req.lojaId
      });

    if (!venda) {

      return res.status(404).json({
        erro:
          "Venda não encontrada"
      });
    }

    res.json({

      id:
        venda._id,

      lojaId:
        venda.lojaId,

      produto:
        venda.produto,

      cliente:
        venda.cliente,

      vendedor:
        venda.vendedor,

      quantidade:
        venda.quantidade,

      valor:
        venda.valor,

      lucro:
        venda.lucro,

      data:
        venda.data
    });

  } catch (err) {

    console.log(
      "ERRO RECIBO:",
      err
    );

    res.status(500).json({

      erro:
        "Erro ao buscar recibo"
    });
  }
});


module.exports = router;