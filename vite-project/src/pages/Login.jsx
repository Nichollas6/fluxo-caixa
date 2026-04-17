import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  // 🔥 URL DO BACKEND ONLINE
  const API = "https://fluxo-caixa-back.onrender.com";

  async function entrar() {
    try {
      const res = await axios.post(`${API}/login`, {
        email: email.trim().toLowerCase(),
        senha: senha.trim(),
      });

      // 💾 salva usuário
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🚀 redireciona
      navigate("/");

    } catch (err) {
      console.log("ERRO LOGIN:", err.response?.data);

      alert(err.response?.data?.erro || "Login inválido");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow w-80">

        <h1 className="text-xl font-bold mb-4 text-center">
          🔐 Login
        </h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-4 rounded"
          placeholder="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
        >
          Entrar
        </button>

      </div>
    </div>
  );
}