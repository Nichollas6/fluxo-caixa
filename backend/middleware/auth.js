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
    // VERIFICAR TOKEN
    // =========================
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredo_super_forte"
    );

    if (!decoded.id || !decoded.lojaId) {
      return res.status(401).json({
        erro: "Token inválido"
      });
    }

    // =========================
    // SALVAR DADOS
    // =========================
    req.user = {
      id: decoded.id,
      lojaId: decoded.lojaId,
      tipo: decoded.tipo,
      email: decoded.email || null
    };

    next();

  } catch (err) {
    console.log("ERRO AUTH:", err.message);

    return res.status(401).json({
      erro: "Token inválido ou expirado"
    });
  }
};