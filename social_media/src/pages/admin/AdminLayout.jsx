import { useState, useEffect } from "react";
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

  // Không cần ngăn scroll ở body nữa vì đã xử lý ở MainLayout

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
        height: "100%", // Sử dụng 100% thay vì 100vh vì đã có MainLayout xử lý
        overflow: "hidden", // Ngăn scroll toàn bộ layout
        position: "relative",
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
          ml: 2,
          mt: 2,
          display: { xs: "none", md: "flex" }, // ẨN HOÀN TOÀN TRÊN MOBILE
          flexDirection: "column",
          overflow: "hidden",
          height: "100%", // Sử dụng 100% của container
          position: "relative", // Thay đổi từ fixed sang relative
          zIndex: 1000,
        }}
      >
        {drawerContent}
      </Paper>

      {/* --- 3. NỘI DUNG CHÍNH --- */}
      <Box 
        sx={{ 
          flex: 1, 
          width: "100%",
          ml: { xs: 0, md: 0 }, // Bỏ margin left vì sidebar không còn fixed
          height: "100%", // Sử dụng 100% thay vì 100vh
          overflow: "auto", // Chỉ nội dung này được scroll
          display: "flex",
          flexDirection: "column",
        }}
      >
        
        {/* Nút mở Menu Admin (Chỉ hiện trên Mobile) - Cố định ở đầu */}
        {isMobile && (
          <Box sx={{ 
            p: { xs: 1, md: 2 }, 
            pb: 0,
            position: "sticky", // Cố định nút menu khi scroll
            top: 0,
            bgcolor: "#f5f7fb",
            zIndex: 100,
          }}>
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

        {/* Container cho nội dung có thể scroll */}
        <Box sx={{ 
          flex: 1,
          p: { xs: 1, md: 2 },
          pt: { xs: isMobile ? 1 : 2, md: 2 }, // Điều chỉnh padding top cho mobile
          overflow: "auto", // Cho phép scroll nội dung
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}