import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Aquí podrías agregar una verificación del token contra el backend para mayor seguridad
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleAccessNodeRed = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.post("http://localhost:3000/start-nodered", {}, {
            headers: {
                Authorization: `${token}`
            }
        });
        console.log(response.data);
        if (response.data.success) {
            window.location.href = `http://localhost:1880`;
        } else {
            alert("Error al iniciar Node-RED");
        }
    } catch (error) {
        console.error("Error al acceder a Node-RED:", error);
        alert("Error al iniciar Node-RED");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#8B0000', padding: '2rem 1.5rem' }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
          <img src="../public/favicon.png" alt="Logo de la App" width="40" height="40" className="d-inline-block align-top" />
          <span style={{ marginLeft: '0.3rem'}}> Multi Node-RED</span>
        </a>
        <div className="ml-auto">
          {isAuthenticated ? (
            <>
              <button
                className="btn"
                style={{ backgroundColor: '#f0f0f0', color: '#8B0000', padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '0.5rem' }}
                onClick={handleAccessNodeRed}
              >
                Node-RED
              </button>
              <button
                className="btn"
                style={{ backgroundColor: '#f0f0f0', color: '#8B0000', padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '0.5rem' }}
                onClick={() => navigate("/perfil")}
              >
                Ver Perfil
              </button>
              <button
                className="btn"
                style={{ backgroundColor: '#f0f0f0', color: '#8B0000', padding: '0.5rem 1rem', fontSize: '1rem' }}
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="btn"
                style={{ backgroundColor: '#f0f0f0', color: '#8B0000', padding: '0.5rem 1rem', fontSize: '1rem', marginRight: '0.5rem' }}
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
              <button
                className="btn"
                style={{ backgroundColor: '#f0f0f0', color: '#8B0000', padding: '0.5rem 1rem', fontSize: '1rem' }}
                onClick={() => navigate("/register")}
              >
                Registrarse
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
