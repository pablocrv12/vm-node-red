import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import comprobarJWT from './comprobarJWT';
import { handleAccessNodeRed } from '../utils/nodeRedUtils';

const Protegido = () => {
    comprobarJWT();

    const navigate = useNavigate();
    const [roleUser, setRoleUser] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [classId, setClassId] = useState('');
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingNodeRed, setLoadingNodeRed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            console.log('Decoded Token:', decodedToken);
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
                axios.get(`http://localhost:3000/api/v1/user/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(res => {
                    setRoleUser(res.data.data.role);
                    setUserName(res.data.data.name.split(' ')[0]);   
                    setLoadingPage(false);
                })
                .catch(err => {
                    console.log(err);
                    navigate('/login');
                });
            } else {
                console.error('User ID not found in token');
                navigate('/login');
            }
        } else {
            navigate('/login');
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

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setClassId('');
    };

    const handleClassIdChange = (event) => {
        setClassId(event.target.value);
    };

    const handleUnirse = async () => {
        const token = localStorage.getItem('token');

        if (!classId) {
            alert('Por favor, introduce el código de la clase');
            return;
        }

        const classLink = `http://localhost:3000/api/v1/class/join/${classId}`;

        try {
            const response = await axios.post(classLink, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.status === 200) {
                alert('Te has unido a la clase exitosamente');
                closeModal();
            } else {
                alert('Error al unirse a la clase');
            }
        } catch (error) {
            console.error('Error al unirse a la clase:', error);
            alert('Error al unirse a la clase');
        }
    };

    if (loadingPage) {
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

            {loadingNodeRed && (
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
                    <p>Estamos configurando su instancia de Node-RED, esto podría tardar unos instantes...</p>
                </div>
            )}

            <div>
                <Container style={{ marginTop: '60px' }}>
                    <Row style={{ marginBottom: '60px' }}>
                        <Col>
                            <h1>Bienvenido, {userName}</h1>
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
                                {roleUser === 'professor' && (
                                    <div>
                                        <h3 style={{ textAlign: 'center' }}>Crea una nueva clase</h3>
                                        <Button onClick={() => navigate('/NuevaClase')} block className="dark-red-button">Nueva Clase</Button>
                                    </div>
                                )}
                                {roleUser === 'student' && (
                                    <div>
                                        <h3 style={{ textAlign: 'center' }}>Únete a una clase</h3>
                                        <Button onClick={openModal} block>Unirse</Button>
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <h3 style={{ textAlign: 'center' }}>Accede a tus clases</h3>
                                <Button onClick={() => navigate('/MisClases')} block>Mis Clases</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} style={{ textAlign: 'center' }}>
                        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Node-RED</h1>
                        <h2 style={{ textAlign: 'center' }}>Accede ya a Node-RED para empezar a crear y gestionar tus flujos de trabajo</h2>
                        <Button onClick={() => handleAccessNodeRed(setLoadingNodeRed)}>Node-RED</Button>
                        {/* Botón Editar Flujos */}
                        <Button
                            onClick={() => navigate(`/MisFlujos/${userId}`)}
                            style={{ marginLeft: '10px' }}
                        >
                            Editar Flujos
                        </Button>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src="/node-red.png" style={{ width: '80%', marginTop: '20px' }} />
                        </div>
                    </Col>
                </Row>
            </Container>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Unirse a una clase"
                ariaHideApp={false}
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    content: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '50%',
                        height: '50%',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                    }
                }}
            >
                <div style={{ textAlign: 'center' }}>
                    <h2>Unirse a una clase</h2>
                    <input 
                        type="text" 
                        value={classId}
                        onChange={handleClassIdChange} 
                        placeholder="Introduce el código de la clase"
                        style={{ width: '100%', marginBottom: '10px' }}
                    />
                    <div>
                        <Button onClick={handleUnirse}>Aceptar</Button>
                        <Button onClick={closeModal} style={{ marginLeft: '10px' }}>Cancelar</Button>
                    </div>
                </div>
            </Modal>

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
};

export default Protegido;
