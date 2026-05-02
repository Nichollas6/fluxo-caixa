module.exports = (req, res, next) => {

  try {

    // usuário autenticado
    if (!req.user) {

      return res.status(401).json({
        erro: "Não autenticado"
      });
    }

    // valida tipo
    if (
      !req.user.tipo ||
      req.user.tipo !== "admin"
    ) {

      return res.status(403).json({
        erro: "Acesso negado"
      });
    }

    next();

  } catch (err) {

    console.log(
      "ERRO ADMIN:",
      err
    );

    return res.status(500).json({
      erro: "Erro interno no middleware admin"
    });
  }
};