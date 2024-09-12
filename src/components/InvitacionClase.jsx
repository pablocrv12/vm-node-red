import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const InvitacionClase = () => {
    comprobarJWT();

    const { classId } = useParams();
    const [className, setClassName] = useState('');
    const [emails, setEmails] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClassName = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get(`http://localhost:3000/api/v1/class/${classId}`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    });
                  
                    setClassName(response.data.data.name);
                    setLoading(false);
                } catch (err) {
                    console.error('Error fetching class name:', err);
                    setError('Failed to load class name');
                    setLoading(false);
                }
            } else {
                setError('No token found');
                setLoading(false);
            }
        };

        fetchClassName();
    }, [classId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipientEmails = emails.split(',').map(email => email.trim());
        const token = localStorage.getItem('token');
        if (token) {
            setLoading(true);
            try {
                await axios.post('http://localhost:3000/api/v1/email/send-invite', { recipientEmails, className, classId }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Invitaciones enviadas exitosamente');
                navigate(-1);
            } catch (error) {
                console.error('Error enviando las invitaciones:', error);
            }
            setLoading(false);
        } else {
            console.error('No token found');
            setLoading(false);
        }
    };

    if (loading) {
        return (
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
        );
    }

    if (error) return <p>{error}</p>;

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
                        Invitar alumnos a la clase {className}
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="emails"
                            label="Emails"
                            name="emails"
                            autoComplete="emails"
                            autoFocus
                            value={emails}
                            multiline
                            rows={4}
                            placeholder="Introduce los correos electrónicos de los alumnos, separados por comas"
                            onChange={(e) => setEmails(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Invitar
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
};

export default InvitacionClase;
