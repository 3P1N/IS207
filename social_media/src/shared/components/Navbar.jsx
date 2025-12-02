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
    Avatar
} from "@mui/material";
import {
    Home,
    Message,
    Search,
    AddCircle,
    AdminPanelSettings,
    Menu as MenuIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AvatarUser from "./AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import SettingDropdown from "./SettingDropDown";

export default function Navbar() {
    const [keyword, setKeyword] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    
    const navigate = useNavigate();
    const { userData } = useContext(AuthContext);
    
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

    const drawerContent = (
        <Box sx={{ width: 280, p: 2 }} role="presentation">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                    Menu
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>

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
            
            <Divider sx={{ mb: 2 }} />

            <List>
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
            </List>
            
            <Divider sx={{ my: 2 }} />
            
             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                 <SettingDropdown />
            </Box>
        </Box>
    );

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            {/* Thêm justifyContent: 'space-between' để đảm bảo Logo và Nút luôn ở 2 đầu nếu ở giữa rỗng */}
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                
                {/* 1. LOGO (Bên trái) */}
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

                {/* 2. SEARCH BAR WRAPPER (Ở giữa) */}
                {/* Box này có flex: 1 để chiếm hết khoảng trống, đẩy Nav Buttons về sát phải */}
                <Box sx={{ 
                    flex: 1, 
                    display: 'flex', 
                    justifyContent: 'center', // Canh giữa thanh tìm kiếm trong khoảng trống này
                    px: { xs: 1, md: 4 }      // Padding ngang để không dính vào Logo/Icon
                }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#f0f2f5',
                            borderRadius: 5,
                            px: 1.5,
                            py: 0.5,
                            width: "100%",        // Chiếm hết chiều rộng của Wrapper
                            maxWidth: '600px',    // Nhưng không quá 600px
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

                {/* 3. NAVIGATION BUTTONS (Bên phải) */}
                {/* Box này sẽ tự động nằm sát phải nhờ flex:1 của Box ở giữa */}
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