import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/Navbar.css';
import axios from 'axios'; // Importar axios si no está ya importado
import { handleAccessNodeRed } from '../utils/nodeRedUtils'; // Importa la función
import checkAuth from './checkAuth';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'; // Importar íconos

const Navbar = () => {
    checkAuth();

    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);

            // Obtener el rol del usuario
            const decodedToken = parseJwt(token);
            if (decodedToken) {
                axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/rol/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(res => {
                    const role = res.data.data.role;
                    const roleMapping = {
                        student: 'Alumno',
                        professor: 'Profesor'
                    };
                    setUserRole(roleMapping[role] || role); // Guardar el rol traducido en el estado
                })
                .catch(err => {
                    console.error('Error fetching user role:', err);
                });
            }
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
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#8B0000', padding: '2rem 1.5rem' }}>
            <div className="container-fluid">
                <a className="navbar-brand" href="#" onClick={() => navigate('/')}>
                    <img src="/favicon.png" alt="Logo de la App" width="40" height="40" className="d-inline-block align-top" />
                    <span style={{ marginLeft: '0.3rem'}}> Multi Node-RED</span>
                </a>
                <div className="ml-auto d-flex align-items-center">
                    {isAuthenticated ? (
                        <>
                            {userRole && (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    border: '2px solid #f0f0f0', 
                                    color: '#f0f0f0', 
                                    padding: '0.3rem 0.8rem', 
                                    borderRadius: '15px', 
                                    marginRight: '1rem' 
                                }}>
                                    {userRole === 'Alumno' ? <FaUserGraduate style={{ marginRight: '0.5rem' }} /> : <FaChalkboardTeacher style={{ marginRight: '0.5rem' }} />}
                                    <span style={{ fontWeight: 'bold' }}>{userRole}</span>
                                </div>
                            )}
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
