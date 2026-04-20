const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "dev_secret";

module.exports = (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    // 🔒 valida header
    if (!auth) {
      return res.status(401).json({ mensagem: "Token não enviado" });
    }

    const parts = auth.split(" ");

    // 🔒 valida formato Bearer
    if (parts.length !== 2) {
      return res.status(401).json({ mensagem: "Token mal formatado" });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ mensagem: "Formato inválido" });
    }

    // 🔐 valida token
    const decoded = jwt.verify(token, SECRET);

    req.user = decoded;

    return next();

  } catch (err) {
    return res.status(401).json({ mensagem: "Token inválido ou expirado" });
  }
};