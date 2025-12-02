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
    Close as CloseIcon,
    Person
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
    // Mobile = màn hình nhỏ hơn 'md' (900px)
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && keyword.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
            // Không cần đóng menu vì search bar nằm ngoài
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // --- NỘI DUNG MENU MOBILE (Chỉ chứa Nav Links & User Info) ---
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
            
            <Divider sx={{ mb: 2 }} />

            {/* Navigation List */}
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
            
            {/* Settings */}
             <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                 <SettingDropdown />
            </Box>
        </Box>
    );

    return (
        <AppBar position="sticky" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar sx={{ display: 'flex', gap: 1 }}>
                
                {/* 1. LOGO */}
                {/* Trên màn hình siêu nhỏ (xs), có thể ẩn chữ Social Media đi để nhường chỗ cho Search nếu cần. 
                    Ở đây tôi dùng display: { xs: 'none', sm: 'block' } cho text. */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton component={RouterLink} to="/" color="primary" sx={{ p: 0, mr: 1 }}>
                        {/* Nếu bạn có Logo dạng ảnh/icon thì đặt ở đây */}
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
                            display: { xs: 'none', sm: 'block' }, // Ẩn chữ trên mobile để search bar dài ra
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Social Media
                    </Typography>
                </Box>

                {/* 2. SEARCH BAR - LUÔN HIỆN VÀ CO GIÃN (FLEX 1) */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : '#f0f2f5',
                        borderRadius: 5,
                        px: 1.5,
                        py: 0.5,
                        flex: 1, // Quan trọng: Chiếm hết khoảng trống còn lại
                        maxWidth: '600px', // Giới hạn chiều rộng tối đa trên desktop
                        mx: { xs: 1, md: 4 } // Margin trái phải tùy màn hình
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

                {/* 3. NAVIGATION BUTTONS */}
                {/* Desktop: Hiện full icon */}
                {!isMobile && (
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
                )}

                {/* Mobile: Hiện Hamburger Menu */}
                {isMobile && (
                    <IconButton
                        color="inherit"
                        edge="end"
                        onClick={handleDrawerToggle}
                    >
                        {/* Có thể dùng Avatar của User làm nút mở menu thay vì icon 3 gạch */}
                        {/* <AvatarUser userData={userData} /> */} 
                        <MenuIcon />
                    </IconButton>
                )}
            </Toolbar>

            {/* DRAWER */}
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