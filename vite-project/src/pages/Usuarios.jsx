import { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {

  const [usuarios, setUsuarios] = useState([]);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("vendedor");

  const API =
    "https://fluxo-caixa-back.onrender.com";

  // usuário logado
  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  // token JWT
  const token =
    localStorage.getItem("token");

  useEffect(() => {

    if (!token) {
      alert("Faça login novamente");
      return;
    }

    carregar();

  }, []);

  // =========================
  // CARREGAR USUÁRIOS
  // =========================
  async function carregar() {

    try {

      const res =
        await axios.get(

          `${API}/usuarios`,

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setUsuarios(res.data);

    } catch (err) {

      console.log(
        err.response?.data || err
      );

      alert(
        err.response?.data?.erro ||
        "Erro ao carregar usuários"
      );
    }
  }

  // =========================
  // CRIAR USUÁRIO
  // =========================
  async function salvar() {

    try {

      if (
        !nome ||
        !email ||
        !senha
      ) {

        alert(
          "Preencha todos os campos"
        );

        return;
      }

      await axios.post(

        `${API}/usuarios`,

        {
          nome,
          email,
          senha,
          tipo
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      alert(
        "Usuário criado com sucesso"
      );

      // limpa form
      setNome("");
      setEmail("");
      setSenha("");
      setTipo("vendedor");

      // recarrega lista
      carregar();

    } catch (err) {

      console.log(
        err.response?.data || err
      );

      alert(
        err.response?.data?.erro ||
        "Erro ao criar usuário"
      );
    }
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        👤 Usuários
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow mb-6 max-w-xl">

        <div className="grid gap-4">

          <input
            placeholder="Nome"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            className="border p-3 rounded"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>
              setSenha(e.target.value)
            }
            className="border p-3 rounded"
          />

          <select
            value={tipo}
            onChange={(e) =>
              setTipo(e.target.value)
            }
            className="border p-3 rounded"
          >

            <option value="vendedor">
              Vendedor
            </option>

            <option value="admin">
              Admin
            </option>

          </select>

          <button
            onClick={salvar}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded"
          >
            Criar Usuário
          </button>

        </div>
      </div>

      {/* LISTA */}
      <div className="bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">
          Lista de usuários
        </h2>

        {
          usuarios.length === 0 ? (

            <p>
              Nenhum usuário encontrado
            </p>

          ) : (

            usuarios.map((u) => (

              <div
                key={u._id}
                className="border-b py-3 flex justify-between"
              >

                <div>
                  <p className="font-semibold">
                    {u.nome || "Sem nome"}
                  </p>

                  <p className="text-sm text-gray-600">
                    {u.email}
                  </p>
                </div>

                <div>
                  <span className="bg-gray-200 px-3 py-1 rounded text-sm">
                    {u.tipo}
                  </span>
                </div>

              </div>
            ))
          )
        }

      </div>
    </div>
  );
}