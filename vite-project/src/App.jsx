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

// 🔐 PROTEÇÃO
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
}

// 🔐 ADMIN
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.tipo === "admin" ? children : <Navigate to="/dashboard" />;
}

// 🔥 LAYOUT
function Layout() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 p-4">
        <Routes>

          {/* 🔁 REDIRECIONA */}
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* 🔐 ROTAS PROTEGIDAS */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
          <Route path="/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
          <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
          <Route path="/caixa" element={<PrivateRoute><Caixa /></PrivateRoute>} />

          {/* 🔐 ADMIN */}
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

        {/* SISTEMA */}
        <Route path="/*" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}