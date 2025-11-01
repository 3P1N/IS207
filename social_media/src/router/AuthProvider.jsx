import { ChildCare } from "@mui/icons-material";
import { createContext, useContext, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({children}) {

    const [userData, setUserData] = useState(null);
    const login = (userData) => setUserData(userData);
    const logout = () => setUserData(null);

    return (
        <AuthContext.Provider value={{userData, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}