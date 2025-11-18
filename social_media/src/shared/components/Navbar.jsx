import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, InputBase } from "@mui/material";
import { Home, Explore, Message, Logout, Login, Search, Settings, AddCircle, AdminPanelSettings } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AvatarUser from "./AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import SettingDropdown from "./SettingDropDown";

export default function Navbar() {
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext);
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && keyword.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
        }
    };
    return (
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "primary.main",
                        fontWeight: "bold",
                    }}
                >
                    FITNESS247
                </Typography>

                {/* Ô tìm kiếm */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#f0f2f5",
                        borderRadius: 5,
                        px: 1.5,
                        py: 0.5,
                        width: "40%",
                    }}
                >
                    <Search sx={{ color: "#888", mr: 1 }} />
                    <InputBase
                        placeholder="Tìm kiếm bạn bè hoặc bài viết..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* Các nút chức năng */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton component={RouterLink} to="/" color="primary">
                        <Home />
                    </IconButton>

                    <IconButton component={RouterLink} to="/message" color="primary">
                        <Message />
                    </IconButton>
                    <IconButton component={RouterLink} to="/create-post" color="primary">
                        <AddCircle />
                    </IconButton>
                    {userData?.role === "admin" && (
                        <IconButton component={RouterLink} to="/admin" color="primary">
                            <AdminPanelSettings />
                        </IconButton>
                    )}


                    <SettingDropdown />

                    <AvatarUser userData={userData} />


                    {/* Nếu user đã login */}

                </Box>
            </Toolbar>
        </AppBar>
    );
}
