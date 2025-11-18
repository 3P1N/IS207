import React, { useContext, useState } from "react";
import { useNavigate, redirect, Link as RouterLink } from "react-router-dom";
import {
    TextField, Button, Card, CardContent, Typography,
    Box, Alert,  InputAdornment, IconButton, CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            await auth.login({ email: formData.email, password: formData.password });

            navigate("/", { replace: true });
        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data);
                const message = error.response.data.message || "Login failed";
                setError(message);
            } else {
                console.error("Login error:", error.message);
                const message = error.message || "Login error";
                setError(message);
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
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

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
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"} // 👈 đổi type
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        aria-label="toggle password visibility"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />} {/* 👈 đổi icon */}
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
