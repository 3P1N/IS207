import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import ForbiddenPage from "../pages/forbidden/ForbiddenPage";
export default function RoleRoute({ roles = [], redirectTo = "/403" }) {
  const { userData } = useContext(AuthContext);


  // Nếu chưa có thông tin user hoặc role chưa hợp lệ
  if (!userData) {
    return <Navigate to={redirectTo} replace />;
  }
  if(!roles.includes(userData.role)){
    return <ForbiddenPage/>
  }

  // Đủ điều kiện → render tiếp các route con
  return <Outlet />;
}
