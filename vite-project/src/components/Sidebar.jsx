import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  console.log("USER SIDEBAR:", user);

  function sair() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-gray-700 text-white"
        : "hover:bg-gray-800 text-gray-300"
    }`;

  return (
    <>
      {/* botão mobile */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 bg-black text-white p-2 rounded z-50"
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      <div
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-[#111827] text-white p-6 z-50
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300
        `}
      >
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-4"
        >
          ❌
        </button>

        <h1 className="text-2xl font-bold mb-6">
          MK Imports
        </h1>

        <nav className="space-y-2 flex flex-col">
          <NavLink
            to="/"
            className={linkClass}
          >
            📊 Home
          </NavLink>

          <NavLink
            to="/vendas"
            className={linkClass}
          >
            🛒 Vendas
          </NavLink>

          <NavLink
            to="/produtos"
            className={linkClass}
          >
            📦 Produtos
          </NavLink>

          <NavLink
            to="/clientes"
            className={linkClass}
          >
            👤 Clientes
          </NavLink>

          <NavLink
            to="/caixa"
            className={linkClass}
          >
            🧾 Caixa
          </NavLink>

          {user?.tipo === "admin" && (
            <>
              <NavLink
                to="/financeiro"
                className={linkClass}
              >
                💸 Financeiro
              </NavLink>

              <NavLink
                to="/usuarios"
                className={linkClass}
              >
                👥 Usuários
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-400">
            👤 {user?.email || "Usuário"}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Tipo: {user?.tipo || "não definido"}
          </p>

          <button
            onClick={sair}
            className="mt-3 bg-red-500 hover:bg-red-600 w-full p-2 rounded"
          >
            Sair
          </button>
        </div>
      </div>
    </>
  );
}