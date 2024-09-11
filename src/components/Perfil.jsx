import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import Navbar from './Navbar';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import checkAuth from './checkAuth';

const defaultTheme = createTheme();

const Perfil = () => {
  checkAuth();

  const navigate = useNavigate();
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
        axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/${decodedToken.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setCurrentName(res.data.data.name);
          setCurrentEmail(res.data.data.email);
          setLoading(false); // Set loading to false after fetching data
        })
        .catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
          setError('Error al obtener los datos del usuario');
          setLoading(false); // Set loading to false in case of error
        });
      }
    }
  }, []);

  function parseJwt(token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const updatedUser = {
      name: data.get('nombre'),
      email: data.get('email'),
    };

    const token = localStorage.getItem('token');
    if (token && userId) {
      axios.patch(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Usuario actualizado:', response.data);
        alert('Perfil actualizado con éxito');
      })
      .catch(error => {
        console.error('Error al actualizar el perfil:', error);
        alert('Hubo un error al actualizar el perfil');
      });
    }
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (!currentPasswordInput || !newPasswordInput) {
        alert('Por favor, complete ambos campos de contraseña.');
        return;
    }

    const token = localStorage.getItem('token');
    if (token && userId) {
        const updateData = {
            currentPassword: currentPasswordInput,
            newPassword: newPasswordInput,
        };

        axios.patch(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/${userId}`, updateData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log('Contraseña actualizada:', response.data);
            alert('Contraseña actualizada con éxito');
            // Limpiar los campos de contraseña
            setCurrentPasswordInput('');
            setNewPasswordInput('');
        })
        .catch(error => {
            console.error('Error al cambiar la contraseña:', error);
            alert('Hubo un error al cambiar la contraseña. Verifique su contraseña actual.');
        });
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <p>Cargando...</p>
        <style>
          {`
            .spinner-container {
              text-align: center;
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: #fff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              z-index: 1000;
            }

            .spinner {
              border: 4px solid rgba(0, 0, 0, 0.1);
              border-radius: 50%;
              border-top: 4px solid #333;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
              margin: 0 auto 10px;
            }

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
      <Navbar />
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'darkred' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Actualizar datos de perfil
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  variant="outlined"
                  id="nombre"
                  name="nombre"
                  autoComplete="nombre"
                  autoFocus
                  value={currentName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  label="Nombre"
                />
              </FormControl>
              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  variant="outlined"
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  label="Email"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Guardar cambios
              </Button>
            </Box>

            <Typography component="h1" variant="h5" sx={{ mt: 4 }}>
              Cambiar Contraseña
            </Typography>
            <Box component="form" noValidate onSubmit={handleChangePassword} sx={{ mt: 1 }}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  variant="outlined"
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  autoFocus
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  label="Contraseña Actual"
                />
              </FormControl>
              <FormControl fullWidth margin="normal" variant="outlined">
                <TextField
                  variant="outlined"
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  label="Nueva Contraseña"
                />
              </FormControl>
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
        </Grid>

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            padding: 4,
          }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            Eliminar cuenta
          </Typography>
          <Typography variant="body1" paragraph>
            Aquí podrás eliminar tu cuenta permanentemente
          </Typography>
          <Button
            variant="contained"
            sx={{ backgroundColor: 'darkred', color: 'white' }} // Estilo del botón
            onClick={() => setShowConfirmationModal(true)}
          >
            Eliminar cuenta
          </Button>
          <Modal
            show={showConfirmationModal}
            onHide={() => setShowConfirmationModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title style={{ textAlign: 'center' }}>
                Eliminar cuenta
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: 'center' }}>
              ¿Estás seguro de que quieres realizar esta acción?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Confirmar
              </Button>
            </Modal.Footer>
          </Modal>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Perfil;
