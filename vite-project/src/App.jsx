import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Caixa from "./pages/Caixa";
import Financeiro from "./pages/Financeiro";
import Vendas from "./pages/Vendas";
import Usuarios from "./pages/Usuarios";

// 🔐 PROTEÇÃO DE ROTA
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user ? children : <Navigate to="/login" />;
}

// 🔐 ADMIN ONLY
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.tipo === "admin" ? children : <Navigate to="/" />;
}

// 🔥 LAYOUT COM SIDEBAR
function Layout() {
  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTEÚDO */}
      <div className="flex-1 p-4">
        <Routes>

          <Route path="/" element={<Dashboard />} />
          <Route path="/vendas" element={<Vendas />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/caixa" element={<Caixa />} />

          {/* 🔐 SOMENTE ADMIN */}
          <Route path="/financeiro" element={
            <AdminRoute>
              <Financeiro />
            </AdminRoute>
          } />

          <Route path="/usuarios" element={
            <AdminRoute>
              <Usuarios />
            </AdminRoute>
          } />

        </Routes>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* SISTEMA PROTEGIDO */}
        <Route path="/*" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}