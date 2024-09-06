import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Protected from './components/Protected';
import Register from './components/Register';
import MisClases from './components/MisClases';
import InvitacionClase from './components/InvitacionClase';
import NuevaClase from './components/NuevaClase';
import Clase from './components/Clase';
import FlowsClase from './components/FlowsClase';
import Participantes from './components/Participantes';
import JoinClass from './components/joinClass';
import SubirFlujo from './components/subirFlujo';
import MisFlows from './components/misflows';
import ModificarClase from "./components/modificarClase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Perfil from "./components/Perfil";
import checkAuth from './components/checkAuth';
import ResetPassword from './components/ResetPassword';
import ChangePassword from './components/ChangePassword';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = parseJwt(token);
      const isExpired = Date.now() >= decodedToken.exp * 1000;

      if (isExpired) {
        console.log('Token has expired');
        localStorage.removeItem('token');
        navigate('/'); // Redirige al usuario a la página de login si el token ha expirado
      } else {
        // El token es válido, opcionalmente puedes hacer alguna acción adicional aquí
        navigate('/protected');
      }
    } else {
      navigate('/'); // Redirige al usuario a la página de login si no existe un token
    }
  }, [navigate]);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
        <Navbar />

        <div>
            <Container style={{ marginTop: '60px' }}>
                <Row style={{ marginBottom: '60px' }}>
                    <Col>
                        <h1>Unete para usar Node-RED como nunca antes</h1>
                        <p>Multi Node-Red te permite guardar tus flujos de trabajo en la nube para acceder a ellos desde cualquier lugar</p>
                    </Col>
                </Row>
            </Container>
        </div>

        <Container style={{ marginTop: '80px' }}>
            <Row style={{ marginBottom: '40px' }}>
                <Col md={6} style={{ textAlign: 'center' }}>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Clases</h1>
                    <Row>
                        <Col md={6}>
                        <h3 style={{ textAlign: 'center' }}>Interactua con tus profesores gracias al sistema de clases</h3>
                        </Col>
                        <Col md={6}>
                            <h3 style={{ textAlign: 'center' }}>Accede a tus clases</h3>
                            
                        </Col>
                    </Row>
                </Col>
                <Col md={6} style={{ textAlign: 'center' }}>
                    <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Node-RED</h1>
                    <h2 style={{ textAlign: 'center' }}>Regístrate y empieza ya a trabajar con Node-RED</h2>
                    
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <img src="/node-red.png" style={{ width: '80%', marginTop: '20px' }} />
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
);
}

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/perfil' element={<Perfil />} />
          <Route path='/protected' element={<Protected />} />
          <Route path='/register' element={<Register />} />
          <Route path='/resetPassword' element={<ResetPassword />} />
          <Route path='/changePassword' element={<ChangePassword />} />
          <Route path='/invitacionClase/:classId' element={<InvitacionClase />} />
          <Route path='/nuevaClase' element={<NuevaClase />} />
          <Route path='/MisClases' element={<MisClases />} />
          <Route path='/clase/:classId' element={<Clase />} />
          <Route path='/clase/:classId/modificar' element={<ModificarClase />} />
          <Route path="/clase/:classId/flowsClase" element={<FlowsClase />} />
          <Route path="/clase/:classId/subirFlujo" element={<SubirFlujo />} />
          <Route path="/clase/:classId/MisFlowsClase" element={<MisFlows />} />
          <Route path="/clase/:classId/participantes" element={<Participantes />} />
          <Route path="/join/:classId" element={<JoinClass />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
