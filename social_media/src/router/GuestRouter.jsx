import { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Outlet, Navigate } from "react-router-dom";


export default function GuestRouter() {
    const { token } = useContext(AuthContext);
    return token ?  <Navigate to="/home" /> : <Outlet />;

}