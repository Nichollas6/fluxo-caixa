import { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("vendedor");

  const API = "http://localhost:3000";

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    try {
      const res = await axios.get(`${API}/usuarios`);
      setUsuarios(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function salvar() {
    console.log("CRIANDO USUÁRIO 🔥");

    try {
      if (!email || !senha) {
        alert("Preencha email e senha");
        return;
      }

      await axios.post(`${API}/usuarios`, {
        email,
        senha,
        tipo
      });

      alert("Usuário criado 🔥");

      setEmail("");
      setSenha("");
      setTipo("vendedor");

      carregar();

    } catch (err) {
      console.log(err);
      alert("Erro ao criar usuário");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">👤 Usuários</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6 max-w-xl">

        <div className="grid gap-4">

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="border p-3 rounded"
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border p-3 rounded"
          >
            <option value="vendedor">Vendedor</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={salvar}
            className="bg-blue-500 text-white p-3 rounded"
          >
            Criar Usuário
          </button>

        </div>

      </div>

      {/* LISTA */}
      <div className="bg-white p-6 rounded shadow">

        {usuarios.map(u => (
          <div key={u._id} className="border-b py-2">
            {u.email} - {u.tipo}
          </div>
        ))}

      </div>

    </div>
  );
}