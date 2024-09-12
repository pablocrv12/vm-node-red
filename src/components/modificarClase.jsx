import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SchoolIcon from '@mui/icons-material/School';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import comprobarJWT from './comprobarJWT';

const defaultTheme = createTheme();

const ModificarClase = () => {
    comprobarJWT();

    const [nombre, setNombre] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const { classId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClass = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/v1/class/${classId}`, { 
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
                `http://localhost:3000/api/v1/class/${classId}`,
                { name: nombre },
                { headers: { Authorization: `${token}` } }
            );
    
            alert('Nombre de la clase modificado correctamente');
            navigate(-1);
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
