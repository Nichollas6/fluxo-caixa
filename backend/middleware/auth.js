const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {

    // =========================
    // DEBUG HEADERS
    // =========================
    console.log(
      "HEADERS:",
      req.headers
    );

    // =========================
    // PEGA AUTH HEADER
    // =========================
    const authHeader =
      req.headers.authorization ||
      req.headers.Authorization;

    console.log(
      "AUTH HEADER:",
      authHeader
    );

    // =========================
    // VALIDA HEADER
    // =========================
    if (!authHeader) {

      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    // =========================
    // FORMATO: Bearer TOKEN
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

    // =========================
    // VALIDA BEARER
    // =========================
    if (
      !/^Bearer$/i.test(
        scheme
      )
    ) {

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

    console.log(
      "TOKEN DECODIFICADO:",
      decoded
    );

    // =========================
    // VALIDA PAYLOAD
    // =========================
    if (
      !decoded.id ||
      !decoded.lojaId
    ) {

      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    // =========================
    // SALVA DADOS
    // =========================
    req.user = {

      id:
        decoded.id,

      lojaId:
        decoded.lojaId,

      tipo:
        decoded.tipo,

      email:
        decoded.email
    };

    req.userId =
      decoded.id;

    req.lojaId =
      decoded.lojaId;

    req.tipo =
      decoded.tipo;

    // =========================
    // NEXT
    // =========================
    next();

  } catch (err) {

    console.log(
      "❌ ERRO AUTH:",
      err
    );

    return res.status(401).json({

      erro:
        "Token inválido ou expirado"
    });
  }
};