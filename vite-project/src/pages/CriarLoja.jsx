import { useState } from "react";
import api from "../services/api";

export default function CriarLoja() {
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function criar() {
    try {
      await api.post("/lojas/criar", {
        nome,
        documento,
        email,
        senha
      });

      alert("Loja criada com sucesso!");

      setNome("");
      setDocumento("");
      setEmail("");
      setSenha("");

    } catch (err) {
      alert(err.response?.data?.erro || "Erro");
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow">

      <h1 className="text-xl font-bold mb-4">
        🏪 Criar Loja
      </h1>

      <input
        placeholder="Nome da loja"
        className="border p-2 w-full mb-2"
        onChange={(e) => setNome(e.target.value)}
      />

      <input
        placeholder="CPF ou CNPJ"
        className="border p-2 w-full mb-2"
        onChange={(e) => setDocumento(e.target.value)}
      />

      <input
        placeholder="Email admin"
        className="border p-2 w-full mb-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha admin"
        className="border p-2 w-full mb-2"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button
        onClick={criar}
        className="bg-blue-600 text-white w-full p-2"
      >
        Criar Loja
      </button>

    </div>
  );
}