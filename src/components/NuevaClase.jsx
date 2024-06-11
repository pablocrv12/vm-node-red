import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

const NuevaClase = () => {
    const [className, setClassName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(
                'http://localhost:3000/api/v1/class', 
                { name: className }, 
                { headers: { Authorization: `${token}` } }
            )
            .then(res => {
                alert('Clase creada con éxito');
                navigate('/protected');
            })
            .catch(err => {
                console.log(err);
                alert('No se ha podido crear la clase');
                navigate('/protected');
            });
        } else {
            navigate('/login');
        }
    };
    
    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'darkred' }}>
                        <SchoolIcon /> {}
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Crea una nueva clase
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="className"
                            label="Nombre de la clase"
                            name="className"
                            autoComplete="className"
                            autoFocus
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                            <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            >
                            Crear
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default NuevaClase;
