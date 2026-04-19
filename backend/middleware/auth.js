const jwt = require("jsonwebtoken");

const SECRET = "segredo_super_forte";

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json("Token não enviado");
  }

  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json("Token inválido");
  }
};