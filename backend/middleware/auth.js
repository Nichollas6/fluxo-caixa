const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // pega authorization
    const authHeader = req.headers.authorization;

    console.log("HEADER:", authHeader);

    // valida header
    if (!authHeader) {
      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    // Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return res.status(401).json({
        erro: "Token mal formatado"
      });
    }

    const [scheme, token] = parts;

    // valida Bearer
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({
        erro: "Formato deve ser: Bearer TOKEN"
      });
    }

    // verifica token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredo_super_forte"
    );

    console.log("TOKEN DECODIFICADO:", decoded);

    // salva usuário
    req.user = {
      id: decoded.id,
      lojaId: decoded.lojaId,
      tipo: decoded.tipo
    };

    // atalhos
    req.userId = decoded.id;
    req.lojaId = decoded.lojaId;
    req.tipo = decoded.tipo;

    next();

  } catch (err) {
    console.log("ERRO AUTH:", err);

    return res.status(401).json({
      erro: "Token inválido ou expirado"
    });
  }
};