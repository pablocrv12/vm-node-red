import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import comprobarJWT from './comprobarJWT';

const FlowsClase = () => {
    comprobarJWT();

    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [flowIdToDelete, setFlowIdToDelete] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken && decodedToken.id) {
                axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(res => {
                    setUserRole(res.data.data.role);

                    axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/flows`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                    .then(async (response) => {
                        const flowsData = response.data.data;
                        for (const flow of flowsData) {
                            try {
                                const userResponse = await axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/flow/user/${flow._id}`, {
                                    headers: {
                                        Authorization: `${token}`
                                    }
                                });
                                const userData = userResponse.data.data;
                                flow.user = userData;
                            } catch (error) {
                                console.error('Error fetching user details:', error);
                                flow.user = { name: 'Unknown', email: 'Unknown' };
                            }
                        }
                        setFlows(flowsData);
                        setLoading(false);
                    })
                    .catch(err => {
                        console.error('Error fetching flows:', err);
                        setError('Failed to load flows');
                        setLoading(false);
                    });
                })
                .catch(err => {
                    console.error('Error fetching user role:', err);
                    navigate('/login');
                });
            } else {
                console.error('User ID not found in token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [classId, navigate]);

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

    const handleDeleteFlow = (flowId) => {
        setFlowIdToDelete(flowId);
        setShowConfirmationModal(true);
    };

    const confirmDeleteFlow = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.patch(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/deleteFlow/${flowIdToDelete}`, null, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setFlows(flows.filter(flow => flow._id !== flowIdToDelete)); 
                setSuccessMessage('Flujo eliminado correctamente'); 
                setTimeout(() => setSuccessMessage(''), 3000);
            }
            setShowConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting flow:', error);
            setShowConfirmationModal(false);
        }
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Cargando...</p>
                <style>
                    {`
                        .spinner-container {
                            text-align: center;
                            font-family: Arial, sans-serif;
                            font-size: 16px;
                            color: #333;
                            position: fixed;
                            top: 50%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            z-index: 1000;
                        }

                        .spinner {
                            border: 4px solid rgba(0, 0, 0, 0.1);
                            border-radius: 50%;
                            border-top: 4px solid #333;
                            width: 40px;
                            height: 40px;
                            animation: spin 1s linear infinite;
                            margin: 0 auto 10px;
                        }

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
        <div>
            <Navbar />
            <h1 className="text-center mt-3 mb-4 font-weight-bold">Flows List</h1>
            {successMessage && <Alert variant="success" className="text-center">{successMessage}</Alert>}  {}
            {flows.length > 0 ? (
                flows.map((flow) => (
                    <Row key={flow._id} className="mb-3">
                        <Col xs={4}>
                            <h2 className="font-weight-bold pl-3">{flow.name}</h2>
                        </Col>
                        <Col xs={4} className="text-center">
                            <p>{flow.user.name} - {flow.user.email}</p>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end pr-3">
                            {}
                            {userRole === 'professor' && (
                                <Button variant="danger" onClick={() => handleDeleteFlow(flow._id)}>Eliminar</Button>
                            )}
                        </Col>
                    </Row>
                ))
            ) : (
                <div>
                    <p>No hay flujos disponibles.</p>
                </div>
            )}
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">Eliminar Flujo</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    ¿Estás seguro de que quieres eliminar este flujo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDeleteFlow}>Eliminar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default FlowsClase;
