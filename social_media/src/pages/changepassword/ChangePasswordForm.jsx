import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField, Button, Card, CardContent, Typography,
  Box, Alert, InputAdornment, IconButton, CircularProgress, Avatar
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset } from "@mui/icons-material";
import { api } from "../../shared/api";

export default function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: ""
  });
  
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  
  // --- THÊM STATE CHO CURRENT PASSWORD ---
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const frogGreen = "#4caf50";
  const darkFrogGreen = "#2e7d32";
  const pondWater = "#e0f7fa";
  const lilyPadLight = "#f1f8e9";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors({ ...fieldErrors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.current_password.trim()) {
      newErrors.current_password = "Vui lòng nhập mật khẩu hiện tại.";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu mới phải có ít nhất 6 ký tự.";
      isValid = false;
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu.";
      isValid = false;
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Mật khẩu xác nhận không khớp.";
      isValid = false;
    }

    setFieldErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/change-password", {
        current_password: formData.current_password,
        new_password: formData.password,
        new_password_confirmation: formData.password_confirmation
      });

      setSuccess("Ribbit! Đổi mật khẩu thành công. 🐸");
      setFormData({ current_password: "", password: "", password_confirmation: "" });
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error(err);
      let msg = "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      if (err.response && err.response.data && err.response.data.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        background: `linear-gradient(135deg, ${pondWater} 0%, #c8e6c9 100%)`,
        p: 2, position: "relative", overflow: "hidden"
      }}
    >
      <Box sx={{ position: "absolute", top: -50, left: -50, width: 200, height: 200, bgcolor: "#a5d6a7", borderRadius: "50%", opacity: 0.3, zIndex: 0 }} />
      <Box sx={{ position: "absolute", bottom: -30, right: -30, width: 150, height: 150, bgcolor: "#81c784", borderRadius: "50%", opacity: 0.3, zIndex: 0 }} />

      <Card
        elevation={6}
        sx={{
          width: "100%", maxWidth: 420, borderRadius: "24px",
          bgcolor: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)",
          border: `2px solid ${frogGreen}`, zIndex: 1,
          transition: "transform 0.3s",
          "&:hover": { boxShadow: "0 8px 24px rgba(76, 175, 80, 0.25)" }
        }}
      >
        <CardContent sx={{ px: 4, py: 5 }}>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 70, height: 70, bgcolor: lilyPadLight, border: `2px solid ${frogGreen}`, mb: 1 }}>
              <span style={{ fontSize: "40px" }} role="img" aria-label="frog">🐸</span>
            </Avatar>
            <Typography variant="h5" sx={{ color: darkFrogGreen, fontWeight: "bold", fontFamily: "'Comic Sans MS', sans-serif" }}>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">Secure your lily pad</Typography>
          </Box>

          {serverError && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{serverError}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            
            {/* --- CẬP NHẬT TEXTFIELD CURRENT PASSWORD --- */}
            <TextField
              label="Current Password"
              name="current_password"
              fullWidth margin="normal" 
              // 1. Sử dụng state showCurrentPassword
              type={showCurrentPassword ? "text" : "password"} 
              value={formData.current_password}
              onChange={handleChange}
              color="success"
              error={!!fieldErrors.current_password}
              helperText={fieldErrors.current_password}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              
              // 2. Thêm InputProps chứa nút bấm
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)} 
                      edge="end" 
                      sx={{ color: darkFrogGreen }}
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
             
            <TextField
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth margin="normal"
              value={formData.password}
              onChange={handleChange}
              color="success"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
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
              fullWidth margin="normal"
              value={formData.password_confirmation}
              onChange={handleChange}
              color="success"
              error={!!fieldErrors.password_confirmation}
              helperText={fieldErrors.password_confirmation}
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
              variant="contained" type="submit" fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockReset />}
              sx={{
                mt: 3, mb: 1, py: 1.5, borderRadius: "50px",
                bgcolor: frogGreen, fontWeight: "bold", fontSize: "1rem", textTransform: "none",
                boxShadow: "0 4px 0 #2e7d32",
                transition: "all 0.1s ease-in-out",
                "&:hover": { bgcolor: "#43a047", transform: "translateY(-2px)", boxShadow: "0 6px 0 #2e7d32" },
                "&:active": { transform: "translateY(2px)", boxShadow: "0 0 0 #2e7d32" }
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