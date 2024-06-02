import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

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
        setShowModal(true);
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
        <div>
            <h1>Class Detail</h1>
            {classDetail && (
                <div>
                    <h2>{classDetail.name}</h2>
                    <p>Número de participantes: {classDetail.students.length}</p>
                    {userRole === 'student' && (
                        <div>
                            <button onClick={handleViewFlows}>Subir Flujo</button>
                            <button>Mis Flows</button>
                        </div>
                    )}
                    {userRole === 'professor' && (
                        <div>
                            <button onClick={handleNavigateToInvitation}>Invitar Alumnos</button>
                            <button onClick={handleViewFlows}>Ver Flows</button>
                            <button onClick={handleVerParticipantes}>Ver Participantes</button>
                        </div>
                    )}
                </div>
            )}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Lista de Flujos</h2>
                        <ul>
                            {flows.map(flow => (
                                <li key={flow._id}>
                                    <span>{flow.name}</span>
                                    <button onClick={() => handleEntregarFlujo(flow._id)}>Entregar</button>
                                    <button onClick={() => handleEliminarFlujo(flow._id)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clase;
