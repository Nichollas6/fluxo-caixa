import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const logado = localStorage.getItem("logado");

  return logado ? children : <Navigate to="/login" />;
}