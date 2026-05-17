const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("HEADERS:", req.headers);
    console.log("AUTHORIZATION:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = {
      id: decoded.id,
      lojaId: decoded.lojaId,
      tipo: decoded.tipo,
      email: decoded.email
    };

    next();

  } catch (err) {
    console.log("ERRO AUTH:", err);

    return res.status(401).json({
      erro: "Token inválido"
    });
  }
};