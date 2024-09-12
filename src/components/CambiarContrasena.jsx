import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField, Button, Typography, Container, Box, CssBaseline } from '@mui/material';


const cambiarContrasena = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token'); // Obtener el token de la URL

    useEffect(() => {
        if (!token) {
            navigate('/'); // Redirigir si no hay token
        }
    }, [token, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        

        try {
            await axios.post('http://localhost:3000/api/v1/reset/reset-password', { token, newPassword: password });
            setSuccess('Contraseña restablecida con éxito. Se le reedirigirá a la página de inicio de sesión...');
            setError('');
            // Redirigir al inicio de sesión o a la página principal
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Error al restablecer la contraseña:', error);
            setError('El tiempo de reestablecimiento de la contraseña ha expirado.');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Restablecer contraseña
                </Typography>
                {success && (
                    <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                        {success}
                    </Typography>
                )}
                {error && (
                    <Typography color="error.main" variant="body2" sx={{ mt: 1 }}>
                        {error}
                    </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Nueva contraseña"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmar nueva contraseña"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Restablecer contraseña
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
export default cambiarContrasena;