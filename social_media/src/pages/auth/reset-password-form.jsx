import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  TextField, Button, Typography, Box, Alert, InputAdornment, IconButton, CircularProgress, Paper
} from "@mui/material";
import { Visibility, VisibilityOff, LockReset, ArrowBack } from "@mui/icons-material";
import { api } from "../../shared/api";

export default function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy token và email từ URL (Laravel thường gửi link dạng: /reset-password?token=...&email=...)
  const token = searchParams.get("token");
  const urlEmail = searchParams.get("email") || "";

  const [formData, setFormData] = useState({
    email: urlEmail, 
    password: "",
    password_confirmation: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Cập nhật lại email nếu URL load chậm hoặc thay đổi
  useEffect(() => {
    if (urlEmail) {
      setFormData(prev => ({ ...prev, email: urlEmail }));
    }
  }, [urlEmail]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Xóa lỗi của trường đang nhập
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc (để xác thực)";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    
    if (!formData.password) newErrors.password = "Mật khẩu mới là bắt buộc";
    else if (formData.password.length < 8) newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

    if (!formData.password_confirmation) newErrors.password_confirmation = "Vui lòng xác nhận mật khẩu";
    else if (formData.password !== formData.password_confirmation) newErrors.password_confirmation = "Mật khẩu không khớp";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
        setError("Token không hợp lệ hoặc bị thiếu. Vui lòng kiểm tra lại đường dẫn trong email.");
        return;
    }

    if (!validate()) return;
    
    setLoading(true);
    try {
      // Gửi đúng 4 trường mà Laravel yêu cầu
      await api.post("/auth/reset-password", {
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        token: token
      });

      setSuccess("Mật khẩu đã được thay đổi thành công!");
      
      // Chuyển hướng sau 2 giây
      setTimeout(() => {
          navigate("/login");
      }, 2000);

    } catch (err) {
      // Xử lý lỗi từ Laravel trả về (400 hoặc 422)
      const msg = err.response?.data?.message || "Đã có lỗi xảy ra.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Logic xác định con ếch che mắt hay mở mắt
  const isAnyPasswordShown = (focusedField === 'password' && showPassword) || (focusedField === 'password_confirmation' && showConfirm);

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
           <IconButton component={RouterLink} to="/login" sx={{ mr: 1, color: 'text.secondary' }}>
             <ArrowBack />
           </IconButton>
           <Typography variant="h5" sx={{ fontWeight: "bold" }}>Đặt lại mật khẩu</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email field - Laravel cần field này để đối chiếu với Token */}
          <TextField
            label="Email xác nhận" 
            name="email" 
            fullWidth 
            margin="dense" 
            value={formData.email} 
            onChange={handleChange}
            onFocus={() => setFocusedField('email')} 
            onBlur={() => setFocusedField(null)}
            error={!!errors.email} 
            helperText={errors.email} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            // Nếu URL đã có email thì có thể để readOnly cho UX tốt hơn, hoặc cho phép sửa nếu user muốn
            // InputProps={{ readOnly: !!urlEmail }} 
          />

          <TextField
            label="Mật khẩu mới" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            fullWidth 
            margin="dense" 
            value={formData.password} 
            onChange={handleChange}
            onFocus={() => setFocusedField('password')} 
            onBlur={() => setFocusedField(null)}
            error={!!errors.password} 
            helperText={errors.password} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Xác nhận mật khẩu" 
            name="password_confirmation" 
            type={showConfirm ? "text" : "password"} 
            fullWidth 
            margin="dense" 
            value={formData.password_confirmation} 
            onChange={handleChange}
            onFocus={() => setFocusedField('password_confirmation')} 
            onBlur={() => setFocusedField(null)}
            error={!!errors.password_confirmation} 
            helperText={errors.password_confirmation} 
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth
            sx={{
              mt: 2, py: 1.5, borderRadius: 2,
              background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
              boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
              fontWeight: 'bold'
            }}
            disabled={loading || !!success}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <LockReset />}
          >
            {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>

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