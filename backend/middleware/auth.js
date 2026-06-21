const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // =========================
    // PEGAR HEADER
    // =========================
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    // =========================
    // VALIDAR FORMATO
    // Bearer TOKEN
    // =========================
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        erro: "Token mal formatado"
      });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        erro: "Use: Bearer TOKEN"
      });
    }

    // =========================
    // VERIFICAR JWT_SECRET
    // =========================
    if (!process.env.JWT_SECRET) {
      console.log("ERRO AUTH: JWT_SECRET não configurado");

      return res.status(500).json({
        erro: "Erro interno de autenticação"
      });
    }

    // =========================
    // VERIFICAR TOKEN
    // =========================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    // =========================
    // VALIDAR CAMPOS
    // =========================
    if (!decoded.id || !decoded.lojaId) {
      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    // =========================
    // SALVAR DADOS NO REQUEST
    // =========================
    req.user = {
      id: decoded.id,
      lojaId: decoded.lojaId,
      tipo: decoded.tipo || null,
      email: decoded.email || null
    };

    next();

  } catch (err) {
    console.log("ERRO AUTH:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        erro: "Token expirado"
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    return res.status(401).json({
      erro: "Falha na autenticação"
    });
  }
};