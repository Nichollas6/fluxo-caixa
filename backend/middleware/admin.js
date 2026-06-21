module.exports = (req, res, next) => {
  try {
    // =========================
    // VERIFICAR AUTENTICAÇÃO
    // =========================
    if (!req.user) {
      return res.status(401).json({
        erro: "Usuário não autenticado"
      });
    }

    // =========================
    // VERIFICAR TIPO DE USUÁRIO
    // =========================
    if (!req.user.tipo) {
      return res.status(403).json({
        erro: "Tipo de usuário não encontrado no token"
      });
    }

    // =========================
    // PERMITIR APENAS ADMIN
    // =========================
    if (req.user.tipo !== "admin") {
      return res.status(403).json({
        erro: "Apenas administradores podem acessar"
      });
    }

    // =========================
    // LIBERAR ACESSO
    // =========================
    next();

  } catch (err) {
    console.log("ERRO MIDDLEWARE ADMIN:", err.message);

    return res.status(500).json({
      erro: "Erro interno no servidor"
    });
  }
};