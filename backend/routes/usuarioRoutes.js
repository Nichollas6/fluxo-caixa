const express = require("express");

const router = express.Router();

const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const SECRET =
  process.env.JWT_SECRET ||
  "dev_secret";


// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {
  try {

    let {
      email,
      senha
    } = req.body;

    // =========================
    // NORMALIZAÇÃO
    // =========================
    email =
      email?.trim().toLowerCase();

    senha =
      senha?.trim();

    if (
      !email ||
      !senha
    ) {

      return res.status(400).json({
        erro:
          "Preencha todos os campos"
      });
    }

    // =========================
    // BUSCA USUÁRIO
    // =========================
    const user =
      await Usuario.findOne({
        email
      })
      .select("+senha");

    if (!user) {

      return res.status(401).json({
        erro:
          "Usuário não encontrado"
      });
    }

    // =========================
    // USUÁRIO DESATIVADO
    // =========================
    if (!user.ativo) {

      return res.status(403).json({
        erro:
          "Usuário desativado"
      });
    }

    // =========================
    // VALIDA SENHA
    // =========================
    const senhaValida =
      await user.compararSenha(
        senha
      );

    if (!senhaValida) {

      return res.status(401).json({
        erro:
          "Senha incorreta"
      });
    }

    // =========================
    // BUSCAR LOJA
    // =========================
    const loja =
      await Loja.findById(
        user.lojaId
      );

    if (!loja) {

      return res.status(404).json({
        erro:
          "Loja não encontrada"
      });
    }

    // =========================
    // LOJA BLOQUEADA
    // =========================
    if (
      loja.status ===
      "bloqueado"
    ) {

      return res.status(403).json({
        erro:
          "Loja bloqueada"
      });
    }

    // =========================
    // TOKEN
    // =========================
    const token =
      jwt.sign(

        {
          id:
            user._id,

          nome:
            user.nome,

          email:
            user.email,

          tipo:
            user.tipo,

          lojaId:
            loja._id
        },

        SECRET,

        {
          expiresIn: "7d"
        }
      );

    // =========================
    // RESPOSTA
    // =========================
    res.json({

      token,

      user: {

        id:
          user._id,

        nome:
          user.nome,

        email:
          user.email,

        tipo:
          user.tipo,

        lojaId:
          loja._id,

        loja: {

          id:
            loja._id,

          nome:
            loja.nome,

          plano:
            loja.plano,

          status:
            loja.status
        }
      }
    });

  } catch (err) {

    console.log(
      "ERRO LOGIN:",
      err
    );

    res.status(500).json({
      erro:
        "Erro no login"
    });
  }
});


// ============================
// CRIAR USUÁRIO
// ============================
router.post("/", auth, admin, async (req, res) => {
  try {

    let {
      nome,
      email,
      senha,
      tipo
    } = req.body;

    email =
      email?.trim().toLowerCase();

    nome =
      nome?.trim();

    senha =
      senha?.trim();

    if (
      !email ||
      !senha
    ) {

      return res.status(400).json({
        erro:
          "Preencha todos os campos"
      });
    }

    // verifica email
    const existe =
      await Usuario.findOne({
        email
      });

    if (existe) {

      return res.status(400).json({
        erro:
          "Email já cadastrado"
      });
    }

    const novoUsuario =
      await Usuario.create({

        nome:
          nome || "",

        email,

        senha,

        tipo:
          tipo || "vendedor",

        lojaId:
          req.lojaId
      });

    res.status(201).json({

      id:
        novoUsuario._id,

      nome:
        novoUsuario.nome,

      email:
        novoUsuario.email,

      tipo:
        novoUsuario.tipo,

      lojaId:
        novoUsuario.lojaId
    });

  } catch (err) {

    console.log(
      "ERRO CRIAR USUÁRIO:",
      err
    );

    res.status(500).json({
      erro:
        "Erro ao criar usuário"
    });
  }
});


// ============================
// LISTAR USUÁRIOS DA LOJA
// ============================
router.get("/", auth, async (req, res) => {
  try {

    const usuarios =
      await Usuario.find({

        lojaId:
          req.lojaId
      })
      .select("-senha")
      .sort({
        createdAt: -1
      });

    res.json(usuarios);

  } catch (err) {

    console.log(
      "ERRO LISTAR USUÁRIOS:",
      err
    );

    res.status(500).json({
      erro:
        "Erro ao buscar usuários"
    });
  }
});


// ============================
// DESATIVAR USUÁRIO
// ============================
router.put(
  "/:id/desativar",
  auth,
  admin,
  async (req, res) => {
    try {

      const usuario =
        await Usuario.findOne({

          _id:
            req.params.id,

          lojaId:
            req.lojaId
        });

      if (!usuario) {

        return res.status(404).json({
          erro:
            "Usuário não encontrado"
        });
      }

      // impede desativar a si mesmo
      if (
        usuario._id.toString() ===
        req.userId
      ) {

        return res.status(400).json({
          erro:
            "Você não pode desativar seu próprio usuário"
        });
      }

      usuario.ativo = false;

      await usuario.save();

      res.json({

        mensagem:
          "Usuário desativado com sucesso"
      });

    } catch (err) {

      console.log(
        "ERRO DESATIVAR USUÁRIO:",
        err
      );

      res.status(500).json({
        erro:
          "Erro ao desativar usuário"
      });
    }
  }
);


module.exports = router;