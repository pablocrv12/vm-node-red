import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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

    useEffect(() => {
        // Función asincrónica para obtener la información de la clase
        const fetchClass = async () => {
            try {
                // Obtener el token de autorización de tu fuente de datos (por ejemplo, localStorage)
                const token = localStorage.getItem('token');

                // Realizar una solicitud GET para obtener la información de la clase
                const response = await axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`,{ 
                    headers: { Authorization: `${token}` 
                }});
                
                // Establecer el nombre de la clase en el estado nombre
                setNombre(response.data.data.name);
                setPlaceholder(nombre);
            } catch (error) {
                console.error('Error al obtener la información de la clase:', error);
            }
        };

        // Llamar a la función para obtener la información de la clase cuando el componente se monte
        fetchClass();
    }, [classId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Obtener el token de autorización de tu fuente de datos (por ejemplo, localStorage)
            const token = localStorage.getItem('token');
    
            // Realizar una solicitud PATCH para modificar el nombre de la clase
            await axios.patch(
                `https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`,
                { name: nombre }, // Cuerpo de la solicitud
                { headers: { Authorization: `${token}` }} // Opciones de la solicitud con el token de autorización
            );
    
            alert('Nombre de la clase modificado correctamente');
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
                    value={nombre || ''} // Proporciona un valor por defecto en caso de que nombre sea indefinido
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder={nombre || ''} // Establece el mismo valor por defecto para el placeholder
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
