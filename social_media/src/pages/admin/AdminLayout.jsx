import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
  Drawer,
  IconButton,
  useTheme,
  useMediaQuery,
  Button
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Icon 3 gạch

const menuItems = [
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý bài viết", to: "/admin/posts" },
];

export default function AdminLayout() {
  const location = useLocation();
  const theme = useTheme();
  // Kiểm tra nếu là màn hình nhỏ (dưới 900px - md)
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // --- NỘI DUNG MENU (Dùng chung cho cả Mobile và Desktop) ---
  const drawerContent = (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="primary">
          Admin Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={() => {
                // Nếu đang ở mobile, chọn xong thì đóng menu lại cho gọn
                if(isMobile) setMobileOpen(false); 
            }}
            sx={{
              borderRadius: 2,
              mx: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "#fff",
                "&:hover": { bgcolor: "primary.dark" },
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f5f7fb",
        minHeight: "calc(100vh - 64px)",
        px: { xs: 1, md: 2 }, // Giảm padding trên mobile
        py: 2,
      }}
    >
      {/* --- 1. MOBILE DRAWER (Chỉ hiện khi isMobile = true và bấm mở) --- */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} // Tối ưu hiệu năng mobile
        sx={{
          display: { xs: "block", md: "none" }, // Chỉ render Drawer logic trên mobile
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 260 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* --- 2. DESKTOP SIDEBAR (Ẩn trên mobile) --- */}
      <Paper
        elevation={3}
        sx={{
          width: 260,
          borderRadius: 3,
          mr: 3,
          display: { xs: "none", md: "flex" }, // ẨN HOÀN TOÀN TRÊN MOBILE
          flexDirection: "column",
          overflow: "hidden",
          height: "fit-content", // Để sidebar không dài vô tận nếu ít item
          minHeight: "300px"
        }}
      >
        {drawerContent}
      </Paper>

      {/* --- 3. NỘI DUNG CHÍNH --- */}
      <Box sx={{ flex: 1, width: "100%" }}>
        
        {/* Nút mở Menu Admin (Chỉ hiện trên Mobile) */}
        {isMobile && (
          <Box sx={{ mb: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<MenuIcon />} 
                onClick={handleDrawerToggle}
                sx={{ bgcolor: 'white' }}
            >
                Menu Quản lý
            </Button>
          </Box>
        )}

        {/* Outlet render các trang con */}
        <Outlet />
      </Box>
    </Box>
  );
}