module.exports = (req, res, next) => {

  try {

    // verifica usuário autenticado
    if (!req.user) {

      return res.status(401).json({
        erro: "Não autenticado"
      });
    }

    // verifica tipo admin
    if (req.user.tipo !== "admin") {

      return res.status(403).json({
        erro: "Acesso negado"
      });
    }

    next();

  } catch (err) {

    console.log(
      "ERRO ADMIN:",
      err.message
    );

    return res.status(500).json({
      erro: "Erro interno"
    });
  }
};