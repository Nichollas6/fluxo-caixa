module.exports = (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json("Não autenticado");
    }

    if (user.tipo !== "admin") {
      return res.status(403).json("Acesso negado");
    }

    next();

  } catch (err) {
    return res.status(500).json("Erro no middleware admin");
  }
};