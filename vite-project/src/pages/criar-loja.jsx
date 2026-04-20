import { useState } from "react";
import api from "../services/api";

export default function CriarLoja() {
  const [form, setForm] = useState({
    nome: "",
    documento: "",
    email: "",
    senha: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await api.post("/criar", form);

      alert("Loja criada com sucesso!");
      console.log(res.data);

      // limpa formulário
      setForm({
        nome: "",
        documento: "",
        email: "",
        senha: ""
      });

    } catch (err) {
      const mensagem =
        err.response?.data?.mensagem ||
        err.response?.data ||
        err.message ||
        "Erro ao criar loja";

      alert(typeof mensagem === "string" ? mensagem : JSON.stringify(mensagem));

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          🏪 Criar Nova Loja
        </h1>

        <input
          type="text"
          name="nome"
          placeholder="Nome da loja"
          value={form.nome}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <input
          type="text"
          name="documento"
          placeholder="CPF ou CNPJ"
          value={form.documento}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <input
          type="email"
          name="email"
          placeholder="Email do admin"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
        />

        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full p-2 rounded"
        >
          {loading ? "Criando..." : "Criar Loja"}
        </button>
      </form>

    </div>
  );
}