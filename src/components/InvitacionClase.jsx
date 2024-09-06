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
import checkAuth from './checkAuth';

const defaultTheme = createTheme();

const InvitacionClase = () => {
    checkAuth();

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
                    const response = await axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`, {
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
            try {
                await axios.post('https://backend-service-830425129942.europe-west1.run.app/api/v1/class/send-invite', { recipientEmails, className, classId }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                alert('Invitaciones enviadas exitosamente');
                navigate(-1);  // Redirige a la página anterior
            } catch (error) {
                console.error('Error enviando las invitaciones:', error);
            }
        } else {
            console.error('No token found');
        }
    };

    if (loading) return <p>Loading...</p>;
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
