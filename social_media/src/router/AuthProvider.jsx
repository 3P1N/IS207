import { ChildCare } from "@mui/icons-material";
import { createContext, useContext, useState } from "react";
import { api } from "../shared/api";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [userData, setUserData] = useState(null);
    // const login = (userData) => setUserData(userData);
    const [token, setToken] = useState(null);
    const login = async (userData) => {

        const response = await api.post("/auth/login", userData);
        
        setUserData(response.data.user);
        setToken(response.data.access_token);
        console.log("Login successful:", response.data);
        return response;

    };
    const logout = () => {
        
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{userData, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}