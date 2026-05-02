module.exports = (req, res, next) => {
  try {
    // verifica autenticação
    if (!req.user) {
      return res.status(401).json({
        erro: "Usuário não autenticado"
      });
    }

    // verifica permissão
    if (req.user.tipo !== "admin") {
      return res.status(403).json({
        erro: "Apenas administradores podem acessar"
      });
    }

    next();

  } catch (err) {
    console.log("ERRO MIDDLEWARE ADMIN:", err);

    return res.status(500).json({
      erro: "Erro interno no servidor"
    });
  }
};