import React from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router-dom";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";

export default function AuthLayout() {
  const { pathname } = useLocation();
  const isLogin = pathname.endsWith("/login");

  const helperText = isLogin ? "Don't have an account?" : "Already have an account?";
  const linkTo = isLogin ? "/signup" : "/login";
  const linkLabel = isLogin ? "Sign up" : "Sign in";


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "#f2f4f8",
        p: 2,
      }}
    >
      <Card sx={{ width: 420, maxWidth: "95%", boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Trang con sẽ render vào đây: LoginForm / SignupForm */}
          <Outlet />

          {/* Khu vực gợi ý chuyển trang */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
            <Button
              component={RouterLink}
              to={linkTo}
              variant="text"
              size="small"
            >
              {linkLabel}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
