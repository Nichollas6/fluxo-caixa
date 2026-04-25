const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    console.log("HEADER:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        erro: "Token não enviado"
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "segredo_super_forte"
    );

    console.log("TOKEN DECODIFICADO:", decoded);

    req.user = decoded;

    next();

  } catch (err) {
    console.log("ERRO AUTH:", err.message);

    return res.status(401).json({
      erro: err.message
    });
  }
};