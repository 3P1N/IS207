import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Đăng nhập:", formData);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f2f4f8",
      }}
    >
      <Card sx={{ width: 360, p: 3, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Đăng nhập
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              Đăng nhập
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
