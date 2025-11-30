import React, { useContext, useState } from "react";
import {
    TextField, Button, Card,
    CardContent, Typography, CircularProgress, Alert,
    InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { AuthContext } from "../../router/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
    const [formData, setFormData] = useState({ email: "", password: "", confirm_password: "", username: "" });
    const [errors, setErrors] = useState({ email: "", username: "", password: "", confirm_password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const navigate = useNavigate();

    const { register } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

        if (!formData.username) newErrors.username = "Username is required";

        if (!formData.password) newErrors.password = "Password is required";

        if (!formData.confirm_password) newErrors.confirm_password = "Confirm password is required";
        else if (formData.password && formData.confirm_password !== formData.password)
            newErrors.confirm_password = "Passwords do not match";

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

            // Thay vì Snackbar, hiển thị modal
            setModalMessage(response.data.message || "Đăng ký thành công, hãy kiểm tra email (thư rác hoặc spam)");
            setModalOpen(true);
        } catch (err) {
            if (err.response) {
                const message = err.response.data.message || "Signup failed";
                setError(message);
            } else {
                setError(err.message || "Signup error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setModalOpen(false);
        navigate("/login"); // Chuyển hướng sau khi click OK
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant="h5" align="center" gutterBottom>
                        Sign up
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
                            error={!!errors.email}
                            helperText={errors.email}
                        />
                        <TextField
                            label="Username"
                            name="username"
                            fullWidth
                            margin="normal"
                            value={formData.username}
                            onChange={handleChange}
                            error={!!errors.username}
                            helperText={errors.username}
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
                        <TextField
                            label="Confirm Password"
                            name="confirm_password"
                            type={showConfirmPassword ? "text" : "password"}
                            fullWidth
                            margin="normal"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            error={!!errors.confirm_password}
                            helperText={errors.confirm_password}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                            aria-label="toggle confirm password visibility"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                            {loading ? "Signing up..." : "Sign up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Modal thông báo */}
            <Dialog open={modalOpen} onClose={handleModalClose}>
                <DialogTitle>Success</DialogTitle>
                <DialogContent>
                    <Typography>{modalMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleModalClose} color="primary" variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
