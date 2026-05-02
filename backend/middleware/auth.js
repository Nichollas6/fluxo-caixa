const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {

    // =========================
    // HEADER AUTHORIZATION
    // =========================
    const authHeader =
      req.headers.authorization;

    // valida header
    if (!authHeader) {

      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    // =========================
    // FORMATO BEARER TOKEN
    // =========================
    const parts =
      authHeader.split(" ");

    if (parts.length !== 2) {

      return res.status(401).json({
        erro: "Token mal formatado"
      });
    }

    const [scheme, token] =
      parts;

    // valida bearer
    if (!/^Bearer$/i.test(scheme)) {

      return res.status(401).json({
        erro:
          "Formato correto: Bearer TOKEN"
      });
    }

    // =========================
    // JWT SECRET
    // =========================
    const secret =
      process.env.JWT_SECRET ||
      "segredo_super_forte";

    // =========================
    // VERIFICA TOKEN
    // =========================
    const decoded =
      jwt.verify(
        token,
        secret
      );

    // =========================
    // VALIDA DADOS
    // =========================
    if (
      !decoded.id ||
      !decoded.lojaId
    ) {

      return res.status(401).json({
        erro:
          "Token inválido"
      });
    }

    // =========================
    // SALVA NO REQUEST
    // =========================
    req.user = {

      id:
        decoded.id,

      lojaId:
        decoded.lojaId,

      tipo:
        decoded.tipo
    };

    req.userId =
      decoded.id;

    req.lojaId =
      decoded.lojaId;

    req.tipo =
      decoded.tipo;

    next();

  } catch (err) {

    console.log(
      "❌ ERRO AUTH:",
      err.message
    );

    return res.status(401).json({

      erro:
        "Token inválido ou expirado"
    });
  }
};