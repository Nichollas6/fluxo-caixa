import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CriarLoja() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    documento: "",
    email: "",
    senha: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const dados = {
      nome: form.nome.trim(),
      documento: form.documento.trim(),
      email: form.email.trim().toLowerCase(),
      senha: form.senha.trim()
    };

    if (!dados.nome || !dados.documento || !dados.email || !dados.senha) {
      alert("Preencha todos os campos");
      return;
    }

    try {
      setLoading(true);

      console.log("📤 Enviando dados:", dados);

      const res = await api.post("/loja/criar", dados);

      console.log("✅ SUCESSO:", res.data);

      alert("Loja criada com sucesso!");

      // salva login automático
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");

    } catch (err) {
      console.log("❌ ERRO COMPLETO:", err);

      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("DADOS:", err.response.data);

        alert(
          JSON.stringify(err.response.data, null, 2)
        );

      } else if (err.request) {
        console.log("❌ Backend não respondeu:", err.request);

        alert("Backend não respondeu");

      } else {
        console.log("❌ Erro frontend:", err.message);

        alert(err.message);
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          🏪 Criar Loja
        </h1>

        <input
          type="text"
          name="nome"
          placeholder="Nome da loja"
          value={form.nome}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="text"
          name="documento"
          placeholder="CPF ou CNPJ"
          value={form.documento}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email do admin"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full p-2 rounded"
        >
          {loading ? "Criando..." : "Criar Loja"}
        </button>

        <p className="text-sm text-center mt-4">
          Já tem conta?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer"
          >
            Entrar
          </span>
        </p>
      </form>
    </div>
  );
}