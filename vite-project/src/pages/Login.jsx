import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function entrar() {
    try {
      const res = await axios.post("http://localhost:3000/login", {
        email,
        senha,
      });

      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch (err) {
      alert("Login inválido");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login Admin</h1>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Senha"
          type="password"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={entrar}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}