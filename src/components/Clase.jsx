import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';
import comprobarJWT from './comprobarJWT';

const Clase = () => {

    comprobarJWT();

    const { classId } = useParams();
    const [classDetail, setClassDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null); 
    const [flows, setFlows] = useState([]);
    const [selectedFlow, setSelectedFlow] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken) {
                const loadTimer = setTimeout(() => {
                    axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                    .then(response => {
                        setClassDetail(response.data.data);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error fetching class detail:', err);
                        setError('Failed to load class details');
                        setLoading(false);
                    });

                    axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/rol/${decodedToken.id}`, {
                        headers: {
                            Authorization: `${token}`
                        } 
                    })
                    .then(res => {
                        setUserRole(res.data.data.role);
                    })
                    .catch(err => {
                        console.log(err);
                        setError('Failed to load user role');
                        setLoading(false);
                    });

                    axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/flows`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                    .then(response => {
                        setFlows(response.data.data);
                    })
                    .catch(error => {
                        console.error('Error fetching flows:', error);
                    });
                }, 500);

                return () => clearTimeout(loadTimer); 
            } else {
                setError('Failed to decode token');
                setLoading(false);
            }
        } else {
            setError('No token found');
            setLoading(false);
        }
    }, [classId]);

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

    const handleViewFlows = () => {
        navigate(`/clase/${classId}/flowsClase`);
    };

    const handleModificar = () => {
        navigate(`/clase/${classId}/modificar`);
    };

    const handleSubirFlows = () => {
        navigate(`/clase/${classId}/subirFlujo`);
    };

    const handleMisFlowsClase = () => {
        navigate(`/clase/${classId}/MisFlowsClase`);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleVerParticipantes = () => {
        navigate(`/clase/${classId}/participantes`);
    };

    const handleNavigateToInvitation = () => {
        navigate(`/invitacionClase/${classId}`);
    };

    const handleEntregarFlujo = (flowId) => {
        setSelectedFlow(flowId);
        setShowModal(false);
        
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/flow/${flowId}`, null, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(response => {
                console.log('Flujo entregado con éxito:', response.data.data);
            })
            .catch(error => {
                console.error('Error al entregar el flujo:', error);
            });
        } else {
            console.error('No token found');
        }
    };

    const handleEliminarFlujo = (flowId) => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.delete(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/deleteFlow/${flowId}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(response => {
                console.log('Flujo eliminado con éxito:', response.data);
                setFlows(flows.filter(flow => flow._id !== flowId));
            })
            .catch(error => {
                console.error('Error al eliminar el flujo:', error);
            });
        } else {
            console.error('No token found');
        }
    };

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

    if (error) return <p>{error}</p>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Navbar />
    
            <Container style={{ marginTop: '60px' }}>
                <Row style={{ marginBottom: '60px' }}>
                    <Col>
                        {classDetail && (
                            <h1 style={{ fontWeight: 'bold' }}>{classDetail.name}</h1>
                        )}
                    </Col>
                </Row>
            </Container>
    
            <Container style={{ marginTop: '80px' }}>
                <Row style={{ marginBottom: '40px' }}>
                    <Col md={6} style={{ textAlign: 'center' }}>
                        {classDetail && (
                            <div>
                                
                                {userRole === 'student' && (    
                                    <div>
                                        <h3>Entrega tus flujos de trabajo</h3>
                                        <Button onClick={handleSubirFlows}>Subir Flujo</Button>
                                    </div>
                                )}
                                {userRole === 'professor' && (
                                  <div>
                                <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Gestiona a tus Alumnos</h1>
                                  <div style={{ marginBottom: '50px' }}>
                                      <Button onClick={handleVerParticipantes} style={{ marginRight: '50px' }}>Ver Participantes</Button>
                                      <Button onClick={handleNavigateToInvitation}>Invitar</Button>
                                  </div>
                                  <div>
                                  </div>
                              </div>
                                )}
                            </div>
                        )}
                    </Col>
                    <Col md={6} style={{ textAlign: 'center' }}>
                    {userRole === 'student' && (
                                    <div>
                                        <h3>Aquí podrás ver los flujos de trabajo compartidos por el profesor de la clase:</h3>
                                        <Button onClick={handleViewFlows}>Flujos</Button>
                                    </div>
                                )}
                                {userRole === 'professor' && (
                                    <div>
                            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Edita tu clase</h1>
                            <Button onClick={handleModificar}>Editar clase</Button>
                            <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginTop : '80px' }}>Flujos de trabajo</h1>
                            <h2 style={{ textAlign: 'center' }}>Aquí puedes publicar flujos en tus clases o ver los flujos de los alumnos</h2>
                                        <Button onClick={handleViewFlows} style={{ marginRight: '50px' }}>Ver Flujos</Button>
                                        <Button onClick={handleSubirFlows}>Publicar Flujo</Button>
                                    </div>
                                )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Clase;
