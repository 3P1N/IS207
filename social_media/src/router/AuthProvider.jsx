import { ChildCare } from "@mui/icons-material";
import { createContext, useContext, useState } from "react";
import { api } from "../shared/api";
import { createEcho } from "../shared/echo";
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {

    const [userData, setUserData] = useState(null);
    // const login = (userData) => setUserData(userData);
    
    const [token, setToken] = useState(null);
    const [echoInstance, setEchoInstance] = useState(null);
    const register = async (userData) => {
        console.log(userData);
        const response = await api.post("/auth/register", userData);
        console.log("Registration successful:", response.data);
        return response;
    }
    
    const login = async (userData) => {

        const response = await api.post("/auth/login", userData);
        
        setUserData(response.data.user);
        setToken(response.data.access_token);
        setEchoInstance(createEcho(response.data.access_token)); // reset echo instance to force re-create with new token
        console.log("Login successful:", response.data);
        return response;

    };

    

    const logout = () => {
        
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{userData, token, login, logout, echoInstance, register }}>
            {children}
        </AuthContext.Provider>
    )
}