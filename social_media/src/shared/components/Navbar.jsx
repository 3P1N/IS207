import { useContext, useState } from "react";
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
    CircularProgress,
    Tooltip,
    tooltipClasses, // Import thêm cái này để sle class con
    styled // <--- 1. Import thêm Tooltip
} from "@mui/material";
import {
    Home,
    Message,
    Search,
    AddCircle,
    AdminPanelSettings,
    Menu as MenuIcon,
    Close as CloseIcon,
    Lock as LockIcon,
    Logout as LogoutIcon
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AvatarUser from "./AvatarUser";
import { AuthContext } from "../../router/AuthProvider";
import SettingDropdown from "./SettingDropDown";

// Tạo một Tooltip mới đã được style lại
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.grey[800], // Màu nền tối (không đen kịt)
        color: theme.palette.common.white,        // Màu chữ trắng
        boxShadow: theme.shadows[2],              // Đổ bóng nhẹ cho nổi
        fontSize: 12,                             // Cỡ chữ gọn gàng
        fontWeight: 500,                          // Chữ hơi đậm cho dễ đọc
        borderRadius: 8,                          // Bo tròn các góc (8px là đẹp)
        padding: "6px 12px",                      // Khoảng cách đệm trong
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.grey[800],           // Màu mũi tên trùng màu nền
    },
}));

export default function Navbar() {
    const [keyword, setKeyword] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const navigate = useNavigate();
    const { userData, logout } = useContext(AuthContext);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleSearch = (e) => {
        if (e.key === "Enter" && keyword.trim() !== "") {
            navigate(`/search?query=${encodeURIComponent(keyword.trim())}`);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMobileLogout = async () => {
        setLogoutLoading(true);
        try {
            await logout();
            handleDrawerToggle();
        } catch (err) {
            console.error("Lỗi đăng xuất:", err);
        } finally {
            setLogoutLoading(false);
        }
    };

    // --- NỘI DUNG MENU MOBILE (Giữ nguyên vì đã có text hiển thị) ---
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

            <Divider sx={{ mb: 1 }} />

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

                <Divider sx={{ my: 1 }} />

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

                <ListItem disablePadding>
                    <ListItemButton onClick={handleMobileLogout}>
                        <ListItemIcon>
                            {logoutLoading ? <CircularProgress size={20} /> : <LogoutIcon color="error" />}
                        </ListItemIcon>
                        <ListItemText
                            primary="Đăng xuất"
                            slotProps={{
                                primary: { style: { color: theme.palette.error.main } }
                            }}
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
                    {/* Tooltip cho logo luôn (tuỳ chọn) */}
                    <CustomTooltip title="Trang chủ">
                        <IconButton component={RouterLink} to="/" color="primary">
                            <Home />
                        </IconButton>
                    </CustomTooltip>
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
                            onKeyDown={handleSearch}
                            sx={{ flex: 1 }}
                        />
                    </Box>
                </Box>

                {/* 3. NAVIGATION BUTTONS (DESKTOP) */}
                <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 'fit-content' }}>
                    {!isMobile ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

                            {/* Sử dụng CustomTooltip thay cho Tooltip */}

                            <CustomTooltip title="Trang chủ">
                                <IconButton component={RouterLink} to="/" color="primary">
                                    <Home />
                                </IconButton>
                            </CustomTooltip>

                            <CustomTooltip title="Tin nhắn">
                                <IconButton component={RouterLink} to="/message" color="primary">
                                    <Message />
                                </IconButton>
                            </CustomTooltip>

                            <CustomTooltip title="Tạo bài viết mới">
                                <IconButton component={RouterLink} to="/create-post" color="primary">
                                    <AddCircle />
                                </IconButton>
                            </CustomTooltip>

                            {userData?.role === "admin" && (
                                <CustomTooltip title="Trang quản trị">
                                    <IconButton component={RouterLink} to="/admin" color="primary">
                                        <AdminPanelSettings />
                                    </IconButton>
                                </CustomTooltip>
                            )}

                            <SettingDropdown />

                            <CustomTooltip title="Trang cá nhân">
                                <IconButton 
                                    component={RouterLink} 
                                    to={`/profile/${userData?.id}`}
                                    sx={{ ml: 0.5, p: 0.5 }}
                                >
                                    <AvatarUser userData={userData} />
                                </IconButton>
                            </CustomTooltip>

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
                slotProps={{
                    paper: { sx: { borderRadius: '20px 0 0 20px' } }
                }}
            >
                {drawerContent}
            </Drawer>
        </AppBar>
    );
}