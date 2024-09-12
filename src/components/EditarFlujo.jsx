import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import comprobarJWT from './comprobarJWT';

const defaultTheme = createTheme();

const EditarFlujo = () => {
    comprobarJWT();
    
    const [nombre, setNombre] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [loading, setLoading] = useState(true);
    const { flowId } = useParams(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchFlow = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/api/v1/flow/${flowId}`, { 
                    headers: { Authorization: `${token}` }
                });
                
                setNombre(response.data.data.name);
                setPlaceholder(response.data.data.name);
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener la información del flujo:', error);
                setLoading(false); 
            }
        };

        fetchFlow();
    }, [flowId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
    
            await axios.patch(
                `http://localhost:3000/api/v1/flow/${flowId}`,
                { name: nombre }, 
                { headers: { Authorization: `${token}` } }
            );
    
            alert('Nombre del flujo modificado correctamente');
            navigate(-1); // Redirige a la página anterior
        } catch (error) {
            console.error('Error al modificar el nombre del flujo:', error);
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
                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: '16px',
                            color: '#333',
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                            zIndex: 1000,
                        }}>
                            <div style={{
                                border: '4px solid rgba(0, 0, 0, 0.1)',
                                borderRadius: '50%',
                                borderTop: '4px solid #333',
                                width: '40px',
                                height: '40px',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 10px'
                            }}></div>
                            <p>Cargando...</p>
                            <style>
                                {`
                                    @keyframes spin {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                `}
                            </style>
                        </div>
                    ) : (
                        <>
                            <Avatar sx={{ m: 1, bgcolor: 'darkblue' }}>
                                <SyncAltIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Modificar nombre del flujo
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
                                    placeholder={placeholder || ''} 
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
                        </>
                    )}
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default EditarFlujo;
