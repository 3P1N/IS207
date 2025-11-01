import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import { Outlet, Navigate } from "react-router-dom";

export default function ProtectedRoute() {
  const { userData } = useContext(AuthContext);
  return userData ? <Outlet /> : <Navigate to="/login" />;
}
