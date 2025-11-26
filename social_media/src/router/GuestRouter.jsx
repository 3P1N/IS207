import { useContext } from "react"
import { AuthContext } from "./AuthProvider"
import { Outlet, Navigate } from "react-router-dom";
import LoadingPage from "../pages/loading/LoadingPage";


export default function GuestRouter() {
    const { userData, authReady } = useContext(AuthContext);
    if(!authReady) return <LoadingPage/>
    return userData ?  <Navigate to="/" /> : <Outlet />;

}