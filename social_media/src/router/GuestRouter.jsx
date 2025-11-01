import { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Outlet, Navigate } from "react-router-dom";


export default function GuestRouter() {
    const { userData } = useContext(AuthContext);
    return userData ?  <Navigate to="/" /> : <Outlet />;

}