import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
const Protected = () => {
    const navigate = useNavigate();
    const [roleUser, setRoleUser] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [classLink, setClassLink] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
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

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            console.log('Decoded Token:', decodedToken); // Para verificar el contenido del token
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
                axios.get(`http://localhost:3000/api/v1/user/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(res => {
                    // Aquí cogemos el rol y el nombre del usuario
                    setRoleUser(res.data.data.role);
                    setUserName(res.data.data.name.split(' ')[0]);   
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
        setClassLink('');
    };

    const handleClassLinkChange = (event) => {
        setClassLink(event.target.value);
    };

    const handleJoinClass = async () => {
        const token = localStorage.getItem('token');

        if (!classLink) {
            alert('Por favor, introduce el enlace de la clase');
            return;
        }

        try {
            const response = await axios.post(classLink, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.status === 200) {
                alert('Te has unido a la clase exitosamente');
                closeModal();
                // Aquí puedes añadir lógica adicional si es necesario, como redireccionar a la página de la clase
            } else {
                alert('Error al unirse a la clase');
            }
        } catch (error) {
            console.error('Error al unirse a la clase:', error);
            alert('Error al unirse a la clase');
        }
    };

        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
                <Navbar />
        
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
                            <Button onClick={handleAccessNodeRed}>Node-RED</Button>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <img src="public\node-red.png" style={{ width: '80%', marginTop: '20px' }} />
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Color y opacidad del fondo oscuro
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
            value={classLink} 
            onChange={handleClassLinkChange} 
            placeholder="Introduce el enlace de la clase"
            style={{ width: '100%', marginBottom: '10px' }} // Establece el ancho del campo de texto al 100%
        />
        <div>
            <Button onClick={handleJoinClass}>Aceptar</Button>
            <Button onClick={closeModal} style={{ marginLeft: '10px' }}>Cancelar</Button>
        </div>
    </div>
</Modal>
            </div>
        );
        
    
    
    
    
    
};

export default Protected;
