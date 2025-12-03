import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  TextField, Button, Typography, Box, Alert, CircularProgress, Paper, IconButton
} from "@mui/material";
import { Send, ArrowBack, MarkEmailRead } from "@mui/icons-material";
import { api } from "../../shared/api"; // Đảm bảo đường dẫn đúng


export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(null); // Xóa lỗi khi gõ lại
  };

  const validate = () => {
    if (!email) {
      setError("Vui lòng nhập email");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validate()) return;

    setLoading(true);
    try {
      // Gọi đúng API endpoint trỏ tới function forgotPassword trong Laravel
      const response = await api.post("/auth/forgot-password", { email });
      
      // Hiển thị message từ backend: 'Gửi mail thành công...'
      setSuccess(response.data.message); 
    } catch (err) {
      // Hiển thị lỗi từ backend (ví dụ 404: 'Email không tồn tại')
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>


      <Paper 
        elevation={6}
        sx={{ 
          width: '100%', p: 4, borderRadius: 4, position: 'relative', zIndex: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
           {/* Nút Back nhỏ gọn */}
           <IconButton component={RouterLink} to="/login" sx={{ mr: 1, color: 'text.secondary' }}>
             <ArrowBack />
           </IconButton>
           <Typography variant="h5" sx={{ fontWeight: "bold", color: "#166534" }}>
             Quên mật khẩu?
           </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && (
          <Alert severity="success" icon={<MarkEmailRead fontSize="inherit" />} sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email đăng ký"
            name="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')} 
            onBlur={() => setFocusedField(null)}
            error={!!error && !success} // Chỉ đỏ lên nếu có lỗi và chưa thành công
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            disabled={loading || !!success} // Disable nếu đang load hoặc đã gửi thành công
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{
              mt: 3, mb: 2, py: 1.5, borderRadius: 2,
              background: "linear-gradient(45deg, #f59e0b 30%, #d97706 90%)", // Màu cam vàng khác biệt chút so với login
              boxShadow: "0 3px 5px 2px rgba(245, 158, 11, .3)",
              fontSize: '1rem', fontWeight: 'bold', textTransform: 'none'
            }}
            disabled={loading || !!success}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
          >
            {loading ? "Đang gửi..." : "Gửi liên kết"}
          </Button>

          {/* BACK TO LOGIN LINK TEXT */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
             <Button component={RouterLink} to="/login" sx={{ textTransform: 'none', color: '#555' }}>
               Quay lại đăng nhập
             </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}