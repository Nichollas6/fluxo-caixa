router.post("/login", async (req, res) => {
  try {
    let { email, senha } = req.body;

    email = (email || "").trim().toLowerCase();
    senha = (senha || "").trim();

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos"
      });
    }

    const user = await Usuario.findOne({ email }).select("+senha");

    if (!user) {
      return res.status(401).json({
        erro: "Usuário não encontrado"
      });
    }

    if (!user.ativo) {
      return res.status(403).json({
        erro: "Usuário desativado"
      });
    }

    if (!user.lojaId) {
      return res.status(400).json({
        erro: "Usuário sem loja vinculada"
      });
    }

    if (!user.senha) {
      return res.status(500).json({
        erro: "Usuário sem senha cadastrada"
      });
    }

    if (typeof user.compararSenha !== "function") {
      return res.status(500).json({
        erro: "Erro interno de autenticação"
      });
    }

    const senhaValida = await user.compararSenha(senha);

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Senha incorreta"
      });
    }

    const loja = await Loja.findById(user.lojaId);

    if (!loja) {
      return res.status(404).json({
        erro: "Loja não encontrada"
      });
    }

    if (loja.status === "bloqueado") {
      return res.status(403).json({
        erro: "Loja bloqueada"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId
      },
      process.env.JWT_SECRET || "segredo_super_forte",
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome || "",
        email: user.email,
        tipo: user.tipo,
        lojaId: user.lojaId,
        loja: {
          id: loja._id,
          nome: loja.nome,
          plano: loja.plano,
          status: loja.status
        }
      }
    });

  } catch (err) {
    console.log("ERRO LOGIN:", err);

    return res.status(500).json({
      erro: "Erro no login",
      detalhe: err.message
    });
  }
});