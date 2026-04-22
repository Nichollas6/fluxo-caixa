import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Login from "./pages/Login";
import CriarLoja from "./pages/CriarLoja";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Caixa from "./pages/Caixa";
import Financeiro from "./pages/Financeiro";
import Vendas from "./pages/Vendas";
import Usuarios from "./pages/Usuarios";


// 🔐 pega usuário com segurança
function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}


// 🔐 PROTEÇÃO GERAL
function PrivateRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// 🔐 ADMIN
function AdminRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.tipo !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// 🔥 LAYOUT PRINCIPAL
function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4">
        <Routes>

          {/* 🔁 REDIRECIONAMENTO */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 🔐 ROTAS PROTEGIDAS */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/vendas"
            element={
              <PrivateRoute>
                <Vendas />
              </PrivateRoute>
            }
          />

          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }
          />

          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <Clientes />
              </PrivateRoute>
            }
          />

          <Route
            path="/caixa"
            element={
              <PrivateRoute>
                <Caixa />
              </PrivateRoute>
            }
          />

          {/* 🔐 ADMIN ONLY */}
          <Route
            path="/financeiro"
            element={
              <AdminRoute>
                <Financeiro />
              </AdminRoute>
            }
          />

          <Route
            path="/usuarios"
            element={
              <AdminRoute>
                <Usuarios />
              </AdminRoute>
            }
          />

        </Routes>
      </div>
    </div>
  );
}


// 🔥 APP PRINCIPAL
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔓 PÚBLICAS */}
        <Route path="/login" element={<Login />} />
        <Route path="/criar-loja" element={<CriarLoja />} />

        {/* 🔐 SISTEMA */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}