import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useNavigate
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import checkAuth from './checkAuth';

const defaultTheme = createTheme();

const ModificarClase = () => {
    checkAuth();

    const [nombre, setNombre] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const { classId } = useParams();
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`, { 
                    headers: { Authorization: `${token}` } 
                });
                
                setNombre(response.data.data.name);
                setPlaceholder(nombre);
            } catch (error) {
                console.error('Error al obtener la información de la clase:', error);
            }
        };

        fetchClass();
    }, [classId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
    
            await axios.patch(
                `https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`,
                { name: nombre },
                { headers: { Authorization: `${token}` } }
            );
    
            alert('Nombre de la clase modificado correctamente');
            navigate(-1); // Redirige a la página anterior
        } catch (error) {
            console.error('Error al modificar el nombre de la clase:', error);
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
                        <SchoolIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Modificar nombre de la clase
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="nombre"
                            label="Nuevo nombre"
                            name="nombre"
                            autoFocus
                            value={nombre || ''} 
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder={nombre || ''}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Guardar cambios
                        </Button>
                    </Box>  
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default ModificarClase;
