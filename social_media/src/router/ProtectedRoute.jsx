import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const { token } = useContext(AuthContext);
  return token ? <Outlet /> : <Navigate to="/login" />;
}
