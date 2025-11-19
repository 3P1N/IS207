import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    TextField, Button, Card, CardContent, Typography,
    Box, Alert, InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Xóa lỗi khi người dùng sửa
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validate()) return; // 🚨 nếu validate thất bại thì dừng submit

        setLoading(true);
        try {
            await auth.login({ email: formData.email, password: formData.password });
            navigate("/", { replace: true });
        } catch (error) {
            if (error.response) {
                const message = error.response.data.message || "Login failed";
                setError(message);
            } else {
                setError(error.message || "Login error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <form onSubmit={handleSubmit} noValidate>
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        margin="normal"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email} // hiển thị đỏ khi có lỗi
                        helperText={errors.email} // hiển thị message lỗi
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
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
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
