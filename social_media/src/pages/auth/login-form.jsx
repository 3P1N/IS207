import React, { useContext, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  TextField, Button, Typography, Alert, InputAdornment, IconButton, CircularProgress, Box, Paper
} from "@mui/material";
import { Visibility, VisibilityOff, Login as LoginIcon } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";


export default function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
       await auth.login(formData); 
       navigate("/", { replace: true });
    } catch (err) {
       setError("Đăng nhập thất bại");
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontWeight: 800, color: "#166534", mb: 1 }}>
          Welcome Back!
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
          Hãy đăng nhập để tiếp tục.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email" name="email" fullWidth margin="normal"
            value={formData.email} onChange={handleChange}
            onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
          
          <TextField
            label="Password" name="password" type={showPassword ? "text" : "password"}
            fullWidth margin="normal"
            value={formData.password} onChange={handleChange}
            onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
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
            
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button component={RouterLink} to="/forgot-password" size="small" sx={{ textTransform: 'none', color: '#16a34a' }}>
              Quên mật khẩu?
            </Button>
          </Box>

          <Button
            variant="contained" type="submit" fullWidth
            sx={{
              mt: 3, mb: 2, py: 1.5, borderRadius: 3,
              background: "linear-gradient(45deg, #22c55e 30%, #16a34a 90%)",
              fontSize: '1rem', fontWeight: 'bold', textTransform: 'none',
              boxShadow: "0 4px 12px rgba(34, 197, 94, 0.4)",
            }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center', pt: 2, borderTop: '1px solid #eee' }}>
             <Typography variant="body2" color="text.secondary">
               Chưa có tài khoản?{' '}
               <Button component={RouterLink} to="/signup" sx={{ fontWeight: 'bold', textTransform: 'none', color: '#166534' }}>
                  Đăng ký ngay
               </Button>
             </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}