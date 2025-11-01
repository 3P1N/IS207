import React, { useContext, useState } from "react";
import { useNavigate, redirect, Link as RouterLink } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { AuthContext } from "../../router/AuthProvider";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        auth.login(formData.email);
        console.log("Đăng nhập:", auth.userData);
        navigate("/", { replace: true });

    };


    return (

        <Card>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

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
                        type="password"
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>

                </form>
            </CardContent>
        </Card>

    );
}
