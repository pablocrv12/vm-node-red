import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Clase = () => {
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
                axios.get(`http://localhost:3000/api/v1/class/${classId}`, {
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

                axios.get(`http://localhost:3000/api/v1/user/rol/${decodedToken.id}`, {
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

                axios.get(`http://localhost:3000/api/v1/class/${classId}/flows`, {
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
            axios.post(`http://localhost:3000/api/v1/class/${classId}/flow/${flowId}`, null, {
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
            axios.delete(`http://localhost:3000/api/v1/class/${classId}/deleteFlow/${flowId}`, {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
            <Navbar />
    
            <Container style={{ marginTop: '60px' }}>
                <Row style={{ marginBottom: '60px' }}>
                    <Col>
                        <h1 style={{ fontWeight: 'bold' }}>{classDetail.name}</h1>
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
                                        <Button onClick={handleMisFlowsClase}>Flujos</Button>
                                        
                                    </div>
                                )}
                                {userRole === 'professor' && (
                                    <div>
                            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>Edita tu clase</h1>
                            <Button onClick={handleModificar}>Guardar cambios</Button>
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
