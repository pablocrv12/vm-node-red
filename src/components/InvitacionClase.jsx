import React, { useState } from 'react';
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

const defaultTheme = createTheme();

const InvitacionClase = ({ className }) => {
    const [emails, setEmails] = useState('');
    const { classId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipientEmails = emails.split(',').map(email => email.trim());
        try {
            await axios.post('https://backend-service-3flglcef2q-ew.a.run.app/api/v1/class/send-invite', { recipientEmails, className, classId });
            alert('Invitations sent successfully');
        } catch (error) {
            console.error('Error sending invitations:', error);
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
                        Invitar alumnos a la clase
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