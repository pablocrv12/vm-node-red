import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Protegido from './components/Protegido';
import Register from './components/Register';
import MisClases from './components/MisClases';
import InvitacionClase from './components/InvitacionClase';
import NuevaClase from './components/NuevaClase';
import Clase from './components/Clase';
import FlowsClase from './components/FlowsClase';
import Participantes from './components/Participantes';
import Unirse from './components/Unirse';
import SubirFlujo from './components/subirFlujo';
import MisFlujos from './components/misFlujos';
import MisFlows from './components/misflows';
import ModificarClase from "./components/modificarClase";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import Perfil from "./components/Perfil";
import comprobarJWT from './components/comprobarJWT';
import RecuperarContrasena from './components/RecuperarContrasena';
import CambiarContrasena from './components/CambiarContrasena';
import EditarFlujo from "./components/EditarFlujo";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = parseJwt(token);
      const isExpired = Date.now() >= decodedToken.exp * 1000;

      if (isExpired) {
        console.log('Token has expired');
        localStorage.removeItem('token');
        navigate('/'); 
        setLoading(false);
      } else {
        navigate('/protegido');
        setLoading(false);
      }
    } else {
      navigate('/');
      setLoading(false);
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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
      <Navbar />
      <div style={{ marginTop: '65px' }}>
        <Container>
          <Row style={{ marginBottom: '60px' }}>
            <Col>
              <h1>Únete para usar Node-RED como nunca antes</h1>
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
          <Route path='/protegido' element={<Protegido />} />
          <Route path='/register' element={<Register />} />
          <Route path='/recuperarContrasena' element={<RecuperarContrasena />} />
          <Route path='/cambiarContrasena' element={<CambiarContrasena />} />
          <Route path='/invitacionClase/:classId' element={<InvitacionClase />} />
          <Route path='/nuevaClase' element={<NuevaClase />} />
          <Route path='/MisClases' element={<MisClases />} />
          <Route path='/clase/:classId' element={<Clase />} />
          <Route path='/clase/:classId/modificar' element={<ModificarClase />} />
          <Route path="/clase/:classId/flowsClase" element={<FlowsClase />} />
          <Route path="/clase/:classId/subirFlujo" element={<SubirFlujo />} />
          <Route path="/clase/:classId/MisFlowsClase" element={<MisFlows />} />
          <Route path="/misFlujos/:userId" element={<MisFlujos />} />
          <Route path="/editarFlujo/:flowId" element={<EditarFlujo />} />
          <Route path="/clase/:classId/participantes" element={<Participantes />} />
          <Route path="/join/:classId" element={<Unirse />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
