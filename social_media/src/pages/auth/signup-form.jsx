import React, { useContext, useState } from "react";
import {
  TextField, Button, Typography, CircularProgress, Alert,
  InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Box, Paper
} from "@mui/material";
import { Visibility, VisibilityOff, PersonAdd, ArrowBack } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";
import { useNavigate, Link as RouterLink } from "react-router-dom"; // Import Link
import FrogAvatar from "../../shared/components/FrogAvatar";

export default function SignupForm() {
  const [formData, setFormData] = useState({ email: "", password: "", confirm_password: "", username: "" });
  const [errors, setErrors] = useState({ email: "", username: "", password: "", confirm_password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  // --- HANDLERS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.username) newErrors.username = "Tên đăng nhập là bắt buộc";
    if (!formData.password) newErrors.password = "Mật khẩu là bắt buộc";
    if (!formData.confirm_password) newErrors.confirm_password = "Nhập lại mật khẩu";
    else if (formData.password && formData.confirm_password !== formData.password)
      newErrors.confirm_password = "Mật khẩu không khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await register({
        email: formData.email,
        name: formData.username,
        password: formData.password,
        password_confirmation: formData.confirm_password,
      });
      setModalMessage(response?.data?.message || "Đăng ký thành công! Vui lòng kiểm tra email.");
      setModalOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Đăng ký thất bại");
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
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, color: "#333" }}>Tạo tài khoản</Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Tham gia cùng chúng tôi ngay hôm nay</Typography>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email" name="email" fullWidth margin="dense" value={formData.email} onChange={handleChange}
            onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
            error={!!errors.email} helperText={errors.email} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Tên người dùng" name="username" fullWidth margin="dense" value={formData.username} onChange={handleChange}
            onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)}
            error={!!errors.username} helperText={errors.username} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            label="Mật khẩu" name="password" type={showPassword ? "text" : "password"} fullWidth margin="dense" value={formData.password} onChange={handleChange}
            onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
            error={!!errors.password} helperText={errors.password} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: showPassword ? '#16a34a' : 'inherit' }}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Nhập lại mật khẩu" name="confirm_password" type={showConfirmPassword ? "text" : "password"} fullWidth margin="dense" value={formData.confirm_password} onChange={handleChange}
            onFocus={() => setFocusedField('confirm_password')} onBlur={() => setFocusedField(null)}
            error={!!errors.confirm_password} helperText={errors.confirm_password} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: showConfirmPassword ? '#16a34a' : 'inherit' }}>
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained" type="submit" fullWidth
            sx={{
              mt: 3, mb: 2, py: 1.5, borderRadius: 2,
              background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
              boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
              fontSize: '1rem', textTransform: 'none', fontWeight: 'bold'
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>

          {/* BACK TO LOGIN LINK */}
          <Box sx={{ mt: 2, textAlign: 'center', pt: 2, borderTop: '1px solid #eee' }}>
             <Typography variant="body2" color="text.secondary">
               Đã có tài khoản?{' '}
               <Button component={RouterLink} to="/login" sx={{ fontWeight: 'bold', textTransform: 'none', color: '#166534' }}>
                  Đăng nhập
               </Button>
             </Typography>
          </Box>

        </form>

        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Thành công!</DialogTitle>
          <DialogContent><Typography>{modalMessage}</Typography></DialogContent>
          <DialogActions>
            <Button onClick={() => { setModalOpen(false); navigate("/login"); }} variant="contained">Đăng nhập ngay</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}