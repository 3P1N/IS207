import React, { useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  TextField, Button, Card, CardContent, Typography,
  Box, Alert, InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";
import { api } from "../../shared/api";

export default function ResetPasswordForm() {
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
  const [searchParams] = useSearchParams();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.current_password) newErrors.current_password = "Current Password is required";

    if (!formData.password) {
      newErrors.password = "New Password is required";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Confirm Password is required";
    }

    // So sánh chỉ khi cả 2 đều có giá trị
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
      setSuccess("Password reset successfully.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response) setError(err.response.data.message || "Reset password failed");
      else setError(err.message || "Reset password error");
    } finally {
      setLoading(false);
    }
  };

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
      <Card sx={{ width: "100%", maxWidth: 400 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Change Password
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Current Password"
              name="current_password"
              fullWidth
              margin="dense"
              value={formData.current_password}
              onChange={handleChange}
              error={!!errors.current_password}
              helperText={errors.current_password}
            />
            <TextField
              label="New Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="dense"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
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
              margin="dense"
              value={formData.password_confirmation}
              onChange={handleChange}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirm(!showConfirm)}
                      edge="end"
                      aria-label="toggle confirm password visibility"
                    >
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
              sx={{ mt: 2 }}
              disabled={loading}
              aria-busy={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
