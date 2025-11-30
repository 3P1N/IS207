import { ChildCare } from "@mui/icons-material";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../shared/api";
import { useNavigate } from "react-router-dom";
import { createEcho } from "../shared/echo";
import LoadingPage from "../pages/loading/LoadingPage";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [userData, setUserData] = useState(null);
    // const login = (userData) => setUserData(userData);
    const [postsData, setPostsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [authReady, setAuthReady] = useState(false);

    const [echoInstance, setEchoInstance] = useState(null);
    const navigate = useNavigate();
    const register = async (userData) => {
        console.log(userData);
        const response = await api.post("/auth/register", userData);
        console.log("Registration successful:", response.data);
        return response;
    }

    const getUserData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/me");
            setUserData(response.data);
            // console.log(response);
            console.log("dữ liệu người dùng: ", userData);
        } catch (err) {
            console.log("lỗi khi lấy thông tin người dùng: ", err);
        } finally {
            setLoading(false);
            setAuthReady(true);
        }
    }
    useEffect(() => {
        setLoading(true);
        if (!userData) { getUserData(); }
        if (!echoInstance) { setEchoInstance(createEcho()); }
    }, []);

    const login = async (userData) => {

        const response = await api.post("/auth/login", userData);
        localStorage.setItem("access_token", response.data.access_token);
        setUserData(response.data.user);

        setTimeout(() => {
            setEchoInstance(createEcho());
        }, 50);
        // await setEchoInstance(createEcho()); // reset echo instance to force re-create with new token
        console.log("Login successful:", response.data);
        return response;

    };



    const logout = async () => {
        const response = await api.post("/auth/logout");
        localStorage.removeItem("access_token");
        setEchoInstance(null);
        setUserData(null);
        navigate("/login");
    }

    if (loading) return <LoadingPage />
    return (
        <AuthContext.Provider value={{ userData,setUserData, login, logout, echoInstance, register, postsData, setPostsData, authReady }}>
            {children}
        </AuthContext.Provider>
    )
}