import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Card, CardContent, Typography,
  Box, Alert, InputAdornment, IconButton, CircularProgress, Avatar
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
// import { api } from "../../shared/api"; // Uncomment khi chạy thực tế

// Giả lập api để demo giao diện (Bạn xóa dòng này khi dùng thật)
const api = { post: () => new Promise(r => setTimeout(r, 1500)) };

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // --- Theme Colors ---
  const frogGreen = "#4caf50";
  const darkFrogGreen = "#2e7d32";
  const pondWater = "#e0f7fa";
  const lilyPadLight = "#f1f8e9";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.current_password) newErrors.current_password = "Current Password is required";
    if (!formData.password) newErrors.password = "New Password is required";
    if (!formData.password_confirmation) newErrors.password_confirmation = "Confirm Password is required";
    if (formData.password && formData.password_confirmation && formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: formData.current_password,
        new_password: formData.password,
        new_password_confirmation: formData.password_confirmation
      });
      setSuccess("Ribbit! Password reset successfully. 🐸");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Reset password failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // Background gradient kiểu hồ nước và lá cây
        background: `linear-gradient(135deg, ${pondWater} 0%, #c8e6c9 100%)`,
        p: 2,
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Trang trí nền (Lá súng mờ) */}
      <Box sx={{
        position: "absolute", top: -50, left: -50, width: 200, height: 200,
        bgcolor: "#a5d6a7", borderRadius: "50%", opacity: 0.3, zIndex: 0
      }} />
      <Box sx={{
        position: "absolute", bottom: -30, right: -30, width: 150, height: 150,
        bgcolor: "#81c784", borderRadius: "50%", opacity: 0.3, zIndex: 0
      }} />

      <Card
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 420,
          // Bo góc lớn để tạo cảm giác mềm mại
          borderRadius: "24px",
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: `2px solid ${frogGreen}`,
          zIndex: 1,
          transition: "transform 0.3s",
          "&:hover": {
            boxShadow: "0 8px 24px rgba(76, 175, 80, 0.25)",
          }
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}>
          
          {/* Header với Icon/Hình ếch */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              sx={{
                width: 70, height: 70,
                bgcolor: lilyPadLight,
                border: `2px solid ${frogGreen}`,
                mb: 1
              }}
            >
              <span style={{ fontSize: "40px" }} role="img" aria-label="frog">🐸</span>
            </Avatar>
            <Typography variant="h5" sx={{ color: darkFrogGreen, fontWeight: "bold", fontFamily: "'Comic Sans MS', sans-serif" }}>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Secure your lily pad
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Current Password"
              name="current_password"
              fullWidth
              margin="normal"
              type="password"
              value={formData.current_password}
              onChange={handleChange}
              error={!!errors.current_password}
              helperText={errors.current_password}
              color="success" // Màu xanh lá khi focus
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: "12px" }
              }}
            />
            
            <TextField
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              color="success"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: darkFrogGreen }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              name="password_confirmation"
              type={showConfirm ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              color="success"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end" sx={{ color: darkFrogGreen }}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockReset />}
              sx={{
                mt: 3,
                mb: 1,
                py: 1.5,
                borderRadius: "50px", // Hình viên thuốc
                bgcolor: frogGreen,
                fontWeight: "bold",
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 4px 0 #2e7d32", // Tạo hiệu ứng 3D nhẹ
                transition: "all 0.1s ease-in-out",
                "&:hover": {
                  bgcolor: "#43a047",
                  transform: "translateY(-2px)", // Nhảy lên nhẹ
                  boxShadow: "0 6px 0 #2e7d32",
                },
                "&:active": {
                  transform: "translateY(2px)", // Nhún xuống khi click
                  boxShadow: "0 0 0 #2e7d32",
                }
              }}
            >
              {loading ? "Hopping to it..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}