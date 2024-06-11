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

const defaultTheme = createTheme();

const Perfil = () => {
  const navigate = useNavigate();
  const [currentName, setCurrentName] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [userId, setUserId] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      console.log('Decoded Token:', decodedToken);
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
        axios.get(`http://localhost:3000/api/v1/user/${decodedToken.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          setCurrentName(res.data.data.name);
          setCurrentEmail(res.data.data.email);
        })
        .catch(error => {
          console.error('Error al obtener los datos del usuario:', error);
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
      axios.patch(`http://localhost:3000/api/v1/user/${userId}`, updatedUser, {
        headers: {
          Authorization: `${token}`
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/user/${userId}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      localStorage.removeItem('token');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Navbar></Navbar>
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
                <InputLabel htmlFor="nombre"></InputLabel>
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
                <InputLabel htmlFor="email"></InputLabel>
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
              <Grid container>
                <Grid item xs>
                </Grid>
                <Grid item>
                </Grid>
              </Grid>
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
