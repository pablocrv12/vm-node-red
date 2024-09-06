import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import { handleAccessNodeRed } from '../utils/nodeRedUtils'; // Importa la función
import checkAuth from './checkAuth';

const Navbar = () => {
    checkAuth();

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false); // Añade el estado de carga

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
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

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#8B0000', padding: '2rem 1.5rem' }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
                    <img src="/favicon.png" alt="Logo de la App" width="40" height="40" className="d-inline-block align-top" />
                    <span style={{ marginLeft: '0.3rem'}}> Multi Node-RED</span>
                </a>
                <div className="ml-auto">
                    {isAuthenticated ? (
                        <>
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
