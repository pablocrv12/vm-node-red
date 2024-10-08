import * as React from 'react';
import { useState } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

const defaultTheme = createTheme();

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/userByEmail/${email}`);
      if (response.data.status === "Ok" && response.data.data.email == email) {
        await axios.post('https://backend-service-830425129942.europe-west1.run.app/api/v1/reset/send-reset-password', { email });
        setSuccess('Se ha enviado un enlace de reestablecimiento de la contraseña a tu correo electrónico.');
        setError('');
      } else {
        setError('El correo electrónico no está registrado. Verifica la dirección de correo electrónico.');
        setSuccess('');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('El correo electrónico no está registrado. Verifica la dirección de correo electrónico.');
      } else {
        setError('No se pudo enviar el correo de recuperación. Verifica la dirección de correo electrónico.');
      }
      setSuccess('');
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ margin: 1, backgroundColor: 'darkred' }}>
            <MailOutlineIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Recuperar Contraseña
          </Typography>
          {error && (
            <Typography color="error" variant="body2" style={{ marginTop: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" variant="body2" style={{ marginTop: 1 }}>
              {success}
            </Typography>
          )}
          <form onSubmit={handleSubmit} noValidate style={{ marginTop: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ marginTop: 3, marginBottom: 2 }}
            >
              Enviar enlace de recuperación
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default RecuperarContrasena;
