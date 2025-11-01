import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Button, InputBase } from "@mui/material";
import { Home, Explore, Message, Logout, Login, Search, Settings } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";


export default function Navbar() {




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
                    MySocial
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
                        sx={{ flex: 1 }}
                    />
                </Box>

                {/* Các nút chức năng */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton component={RouterLink} to="/" color="primary">
                        <Home />
                    </IconButton>
                    <IconButton component={RouterLink} to="/explore" color="primary">
                        <Explore />
                    </IconButton>
                    <IconButton component={RouterLink} to="/message" color="primary">
                        <Message />
                    </IconButton>
                    <IconButton component={RouterLink} to="/setting" color="primary">
                        <Settings />
                    </IconButton>

                    {/* Nếu user đã login */}
                    
                </Box>
            </Toolbar>
        </AppBar>
    );
}
