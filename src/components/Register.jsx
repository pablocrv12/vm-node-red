import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

export default function Register() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [role, setRole] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (email && pass && nombre && apellidos && role) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [email, pass, nombre, apellidos, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://backend-service-830425129942.europe-west1.run.app/api/v1/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          role: role,
          name: `${nombre} ${apellidos}`
        })
      });

      const result = await response.json();
      if (result.success) {
        alert('Te has registrado correctamente');
        navigate('/login');
      } else {
        alert('El correo electrónico ya está en uso, por favor, inténtalo con otro:');
      }
    } catch (error) {
      alert('El correo electrónico ya está en uso, por favor, inténtalo con otro:');
    } finally {
      setLoading(false); 
    }
  };

  const handleRoleChange = (event) => {
    const value = event.target.value;
    setRole(value);
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
            <LockOutlinedIcon sx={{color:'white' }} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Regístrate
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="Nombre"
                  required
                  fullWidth
                  id="nombre"
                  label="Nombre"
                  autoFocus
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="apellidos"
                  label="Apellidos"
                  name="apellidos"
                  autoComplete="apellidos"
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Correo electrónico"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={role === 'professor'}
                      onChange={handleRoleChange}
                      value="professor"
                      name="role"
                      color="primary"
                    />
                  }
                  label="Profesor"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={role === 'student'}
                      onChange={handleRoleChange}
                      value="student"
                      name="role"
                      color="primary"
                    />
                  }
                  label="Alumno"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={!isFormValid || loading}
            >
              Unirse
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={() => navigate('/login')}>
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
        {loading && (
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
