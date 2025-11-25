import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export default function RoleRoute({ roles = [], redirectTo = "/403" }) {
  const { userData } = useContext(AuthContext);

  // Nếu chưa đăng nhập → quay lại login

  // Nếu chưa có thông tin user hoặc role chưa hợp lệ
  if (!userData || !roles.includes(userData.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Đủ điều kiện → render tiếp các route con
  return <Outlet />;
}
