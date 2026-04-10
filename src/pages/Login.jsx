import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function logar() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.senha === senha) {
      localStorage.setItem("logado", "true");
      navigate("/");
    } else {
      alert("Login inválido");
    }
  }

  function cadastrar() {
    localStorage.setItem(
      "user",
      JSON.stringify({ email, senha })
    );
    alert("Usuário cadastrado!");
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow w-80">
        <h1 className="text-2xl mb-4">Login</h1>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          className="border p-2 w-full mb-3"
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          onClick={logar}
          className="bg-blue-500 text-white w-full p-2 mb-2"
        >
          Entrar
        </button>

        <button
          onClick={cadastrar}
          className="bg-green-500 text-white w-full p-2"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}