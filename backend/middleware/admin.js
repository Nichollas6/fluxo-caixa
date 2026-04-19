module.exports = (req, res, next) => {
  if (!req.user) return res.status(401).json("Não autenticado");

  if (req.user.tipo !== "admin") {
    return res.status(403).json("Acesso negado");
  }

  next();
};