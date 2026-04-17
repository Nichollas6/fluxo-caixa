import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  function sair() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  // 🎯 estilo ativo
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 p-2 rounded transition ${
      isActive
        ? "bg-gray-700 text-white"
        : "hover:bg-gray-800 text-gray-300"
    }`;

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 bg-black text-white p-2 rounded z-50"
      >
        ☰
      </button>

      {/* OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:relative top-0 left-0 h-full w-64 bg-[#111827] text-white p-6 z-50
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 transition-transform duration-300
        `}
      >
        {/* FECHAR MOBILE */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden mb-4"
        >
          ❌
        </button>

        {/* LOGO */}
        <h1 className="text-2xl font-bold mb-6">MK Imports</h1>

        {/* MENU */}
        <nav className="space-y-2 flex flex-col">

          <NavLink to="/" className={linkClass} onClick={() => setOpen(false)}>
            📊 <span>Home</span>
          </NavLink>

          <NavLink to="/vendas" className={linkClass} onClick={() => setOpen(false)}>
            🛒 <span>Vendas</span>
          </NavLink>

          <NavLink to="/produtos" className={linkClass} onClick={() => setOpen(false)}>
            📦 <span>Produtos</span>
          </NavLink>

          <NavLink to="/clientes" className={linkClass} onClick={() => setOpen(false)}>
            👤 <span>Clientes</span>
          </NavLink>

          <NavLink to="/caixa" className={linkClass} onClick={() => setOpen(false)}>
            🧾 <span>Caixa</span>
          </NavLink>

          {/* ADMIN */}
          {user?.tipo === "admin" && (
            <>
              <NavLink to="/financeiro" className={linkClass} onClick={() => setOpen(false)}>
                💸 <span>Financeiro</span>
              </NavLink>

              <NavLink to="/usuarios" className={linkClass} onClick={() => setOpen(false)}>
                👤 <span>Usuários</span>
              </NavLink>
            </>
          )}

        </nav>

        {/* RODAPÉ */}
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-400">👤 {user?.email || "Usuário"}</p>

          <button
            onClick={sair}
            className="mt-2 bg-red-500 hover:bg-red-600 w-full p-2 rounded transition"
          >
            Sair
          </button>
        </div>

      </div>
    </>
  );
}