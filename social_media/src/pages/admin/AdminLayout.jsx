import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";

const menuItems = [
  { label: "Quản lý người dùng", to: "/admin/users" },
  { label: "Quản lý bài viết", to: "/admin/posts" },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        bgcolor: "#f5f7fb",
        minHeight: "calc(100vh - 64px)", // chiều cao bên dưới navbar (tạm lấy 64px)
        px: 2,
        py: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: 260,
          borderRadius: 3,
          mr: 3,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold">
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
              sx={{
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
      </Paper>

      {/* Nội dung chính */}
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
