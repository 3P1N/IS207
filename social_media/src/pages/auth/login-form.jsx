import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";

export default function LoginForm() {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Đăng nhập:", formData);
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
