import * as React from 'react';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const defaultTheme = createTheme();

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Estado para manejar el mensaje de error
  const [loading, setLoading] = useState(false); // Estado para manejar el spinner de carga
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Mostrar el spinner al iniciar sesión

    try {
      const response = await axios.post("https://backend-service-830425129942.europe-west1.run.app/login", { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token); // Almacenar token en localStorage
      navigate('/protected'); // Redirigir a la ruta protegida
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Usuario o contraseña incorrectos'); // Establecer el mensaje de error
    } finally {
      setLoading(false); // Ocultar el spinner después de la respuesta
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Accede a tu cuenta
          </Typography>
          {error && ( // Mostrar el mensaje de error si existe
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading} // Deshabilitar el botón mientras carga
            >
              Iniciar sesión
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => navigate('/resetPassword')}>
                  ¿Has olvidado tu contraseña?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate('/register')}>
                  {"¿Todavía no tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {loading && ( // Spinner que se muestra mientras está cargando
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
          </div>
        )}
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          `}
        </style>
      </Container>
    </ThemeProvider>
  );
}
