import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";


export default function SignupForm() {

    const [formData, setFormData] = useState({ email: "", password: "", username: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Đăng ký:", formData);
    };

    return (

        <Card>
            <CardContent>
                <Typography variant="h5" align="center" gutterBottom>
                    Sign up
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
                    <TextField
                        label="User Name"
                        name="username"
                        type="username"
                        fullWidth
                        margin="normal"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Sign up
                    </Button>

                </form>
            </CardContent>
        </Card>

    );
}

