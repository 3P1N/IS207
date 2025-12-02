import React, { useContext, useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    InputBase,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    Divider,
    CircularProgress // Import thêm loading
} from "@mui/material";
import {
    Home,
    Message,
    Search,
    AddCircle,
    AdminPanelSettings,
    Menu as MenuIcon,
    Close as CloseIcon,
    Lock as LockIcon,     // Import icon khóa
    Logout as LogoutIcon  // Import icon đăng xuất
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AvatarUser from "./AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import SettingDropdown from "./SettingDropDown";

export default function Navbar() {
    const [keyword, setKeyword] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    // State loading cho nút Logout trong Drawer
    const [logoutLoading, setLogoutLoading] = useState(false); 
    
    const navigate = useNavigate();
    // Lấy thêm hàm logout từ Context
    const { userData, logout } = useContext(AuthContext); 
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && keyword.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // --- XỬ LÝ LOGOUT TRÊN MOBILE ---
    const handleMobileLogout = async () => {
        setLogoutLoading(true);
        try {
            await logout();
            handleDrawerToggle(); // Đóng menu sau khi logout
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
        } finally {
            setLogoutLoading(false);
        }
    };

    // --- NỘI DUNG MENU MOBILE ---
    const drawerContent = (
        <Box sx={{ width: 280, p: 2 }} role="presentation">
            {/* Header Drawer */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    Menu
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Info User */}
            <Box 
                sx={{ 
                    display: "flex", alignItems: "center", gap: 1.5, mb: 2, p: 1.5, 
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100', 
                    borderRadius: 2,
                    cursor: 'pointer'
                }}
                onClick={() => {
                    navigate(`/profile/${userData?.id}`);
                    handleDrawerToggle();
                }}
            >
                <AvatarUser userData={userData} />
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {userData?.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Xem trang cá nhân
                    </Typography>
                </Box>
            </Box>
            
            <Divider sx={{ mb: 1 }} />

            <List>
                {/* Các menu chính */}
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/" onClick={handleDrawerToggle}>
                        <ListItemIcon><Home color="primary" /></ListItemIcon>
                        <ListItemText primary="Trang chủ" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/message" onClick={handleDrawerToggle}>
                        <ListItemIcon><Message color="primary" /></ListItemIcon>
                        <ListItemText primary="Tin nhắn" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton component={RouterLink} to="/create-post" onClick={handleDrawerToggle}>
                        <ListItemIcon><AddCircle color="primary" /></ListItemIcon>
                        <ListItemText primary="Tạo bài viết" />
                    </ListItemButton>
                </ListItem>
                {userData?.role === "admin" && (
                    <ListItem disablePadding>
                        <ListItemButton component={RouterLink} to="/admin" onClick={handleDrawerToggle}>
                            <ListItemIcon><AdminPanelSettings color="primary" /></ListItemIcon>
                            <ListItemText primary="Quản trị viên" />
                        </ListItemButton>
                    </ListItem>
                )}

                <Divider sx={{ my: 1 }} />

                {/* --- PHẦN THAY ĐỔI: SETTING TRỰC TIẾP --- */}
                
                {/* 1. Nút Đổi mật khẩu */}
                <ListItem disablePadding>
                    <ListItemButton 
                        onClick={() => {
                            navigate("/change-password");
                            handleDrawerToggle();
                        }}
                    >
                        <ListItemIcon><LockIcon color="action" /></ListItemIcon>
                        <ListItemText primary="Đổi mật khẩu" />
                    </ListItemButton>
                </ListItem>

                {/* 2. Nút Đăng xuất */}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleMobileLogout}>
                        <ListItemIcon>
                            {logoutLoading ? <CircularProgress size={20} /> : <LogoutIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText 
                            primary="Đăng xuất" 
                            primaryTypographyProps={{ color: 'error.main' }} // Chữ đỏ cho nút đăng xuất
                        />
                    </ListItemButton>
                </ListItem>

            </List>
        </Box>
    );

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                
                {/* 1. LOGO */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
                    <IconButton component={RouterLink} to="/" color="primary" sx={{ p: 0, mr: 1 }}>
                        <Home fontSize="large" /> 
                    </IconButton>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        sx={{
                            textDecoration: "none",
                            color: "primary.main",
                            fontWeight: "bold",
                            display: { xs: 'none', sm: 'block' },
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Social Media
                    </Typography>
                </Box>

                {/* 2. SEARCH BAR WRAPPER */}
                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center',
                    px: { xs: 1, md: 4 }
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#f0f2f5',
                            borderRadius: 5,
                            px: 1.5,
                            py: 0.5,
                            width: "100%",
                            maxWidth: '600px',
                        }}
                    >
                        <Search sx={{ color: "text.secondary", mr: 1 }} />
                        <InputBase
                            placeholder={isMobile ? "Tìm kiếm..." : "Tìm kiếm bạn bè hoặc bài viết..."}
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                </Box>

                {/* 3. NAVIGATION BUTTONS */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
                    {!isMobile ? (
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

                            {/* Desktop vẫn giữ Dropdown */}
                            <SettingDropdown />
                            <AvatarUser userData={userData} />
                        </Box>
                    ) : (
                        <IconButton
                            color="inherit"
                            edge="end"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>

            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                PaperProps={{ sx: { borderRadius: '20px 0 0 20px' } }}
            >
                {drawerContent}
            </Drawer>
        </AppBar>
    );
}