const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");

const Usuario = require("../models/Usuario");
const Loja = require("../models/Loja");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const SECRET =
  process.env.JWT_SECRET ||
  "segredo_super_forte";


// ============================
// LOGIN
// ============================
router.post("/login", async (req, res) => {

  try {

    let { email, senha } = req.body;

    // =========================
    // NORMALIZAÇÃO
    // =========================
    email =
      String(email || "")
        .trim()
        .toLowerCase();

    senha =
      String(senha || "")
        .trim();

    // =========================
    // VALIDAÇÃO
    // =========================
    if (!email || !senha) {

      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    // =========================
    // BUSCA USUÁRIO
    // =========================
    const user =
      await Usuario.findOne({
        email
      }).select("+senha");

    console.log("USER:", user);

    if (!user) {

      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    // =========================
    // USUÁRIO INATIVO
    // =========================
    if (!user.ativo) {

      return res.status(403).json({
        erro: "Usuário desativado"
      });
    }

    // =========================
    // VALIDA SENHA
    // =========================
    const senhaValida =
      await user.compararSenha(
        senha
      );

    console.log(
      "SENHA VALIDA:",
      senhaValida
    );

    if (!senhaValida) {

      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    // =========================
    // BUSCA LOJA
    // =========================
    const loja =
      await Loja.findById(
        user.lojaId
      );

    console.log("LOJA:", loja);

    if (!loja) {

      return res.status(404).json({
        erro: "Loja não encontrada"
      });
    }

    // =========================
    // LOJA BLOQUEADA
    // =========================
    if (
      loja.status === "bloqueado"
    ) {

      return res.status(403).json({
        erro: "Loja bloqueada"
      });
    }

    // =========================
    // GERA TOKEN
    // =========================
    const token =
      jwt.sign(

        {
          id: user._id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo,
          lojaId: user.lojaId
        },

        SECRET,

        {
          expiresIn: "7d"
        }
      );

    // =========================
    // RESPOSTA
    // =========================
    return res.json({

      sucesso: true,

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
          user.lojaId,

        loja: {

          id:
            loja._id,

          nome:
            loja.nome,

          email:
            loja.email,

          documento:
            loja.documento,

          plano:
            loja.plano,

          status:
            loja.status
        }
      }
    });

  } catch (err) {

    console.log(
      "❌ ERRO LOGIN:",
      err
    );

    return res.status(500).json({

      erro:
        "Erro interno no login",

      detalhe:
        err.message
    });
  }
});


// ============================
// CRIAR USUÁRIO
// ============================
router.post(
  "/",
  auth,
  admin,
  async (req, res) => {

    try {

      let {
        nome,
        email,
        senha,
        tipo
      } = req.body;

      // =========================
      // NORMALIZAÇÃO
      // =========================
      nome =
        String(nome || "")
          .trim();

      email =
        String(email || "")
          .trim()
          .toLowerCase();

      senha =
        String(senha || "")
          .trim();

      tipo =
        tipo || "vendedor";

      // =========================
      // VALIDAÇÃO
      // =========================
      if (!email || !senha) {

        return res.status(400).json({
          erro: "Preencha todos os campos"
        });
      }

      // =========================
      // VERIFICA EMAIL
      // =========================
      const existe =
        await Usuario.findOne({
          email
        });

      if (existe) {

        return res.status(400).json({
          erro: "Email já cadastrado"
        });
      }

      // =========================
      // CRIA USUÁRIO
      // =========================
      const novoUsuario =
        await Usuario.create({

          nome,

          email,

          senha,

          tipo,

          ativo: true,

          lojaId:
            req.lojaId
        });

      return res.status(201).json({

        sucesso: true,

        usuario: {

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
        }
      });

    } catch (err) {

      console.log(
        "❌ ERRO CRIAR USUÁRIO:",
        err
      );

      return res.status(500).json({

        erro:
          "Erro ao criar usuário",

        detalhe:
          err.message
      });
    }
  }
);


// ============================
// LISTAR USUÁRIOS
// ============================
router.get(
  "/",
  auth,
  async (req, res) => {

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

      return res.json(
        usuarios
      );

    } catch (err) {

      console.log(
        "❌ ERRO LISTAR USUÁRIOS:",
        err
      );

      return res.status(500).json({

        erro:
          "Erro ao listar usuários"
      });
    }
  }
);


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

      return res.json({

        sucesso: true,

        mensagem:
          "Usuário desativado com sucesso"
      });

    } catch (err) {

      console.log(
        "❌ ERRO DESATIVAR USUÁRIO:",
        err
      );

      return res.status(500).json({

        erro:
          "Erro ao desativar usuário"
      });
    }
  }
);

module.exports = router;