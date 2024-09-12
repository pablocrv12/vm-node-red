import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, Alert } from 'react-bootstrap';
import Navbar from './Navbar';

const MisFlujos = () => {
    const { userId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [flowIdToDelete, setFlowIdToDelete] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (userId) {
            axios.get(`http://localhost:3000/api/v1/user/flows/${userId}`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(res => {
                setFlows(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setError('Failed to load flows');
                setLoading(false);
            });
        }
    }, [userId]);

    const handleDeleteFlow = (flowId) => {
        setFlowIdToDelete(flowId);
        setShowConfirmationModal(true);
    };

    const confirmDeleteFlow = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setDeleting(true);
            const updatedFlows = flows.filter(flow => flow._id !== flowIdToDelete);

            axios.patch(`http://localhost:3000/api/v1/user/${userId}`, {
                flows: updatedFlows.map(flow => flow._id)
            }, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                setShowConfirmationModal(false);
                setFlows(updatedFlows);
                setSuccessMessage('Flujo eliminado correctamente');
                setDeleting(false);

                setTimeout(() => {
                    setSuccessMessage('');
                }, 1000);
            })
            .catch(error => {
                console.error('Error updating user flows:', error);
                setShowConfirmationModal(false);
                setDeleting(false);
            });
        }
    };

    const handleEditFlow = (flowId) => {
        navigate(`/editarFlujo/${flowId}`);
    };

    if (loading || deleting) {
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
                <p>{loading ? 'Cargando...' : 'Eliminando...'}</p>
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
        <div>
            <Navbar />
            <div style={{ marginTop: '70px', textAlign: 'center' }}>
                <h1>Mis Flujos</h1>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <ul className="list-group">
                    {flows.length > 0 ? (
                        flows.map((flow) => (
                            <li key={flow._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h2><strong>{flow.name}</strong></h2>
                                    <p>{flow.description}</p>
                                </div>
                                <div>
                                    <Button variant="primary" onClick={() => handleEditFlow(flow._id)} style={{ marginRight: '10px' }}>Cambiar nombre</Button>
                                    <Button variant="danger" onClick={() => handleDeleteFlow(flow._id)}>Eliminar</Button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div>
                            <p>No tienes flujos disponibles.</p>
                        </div>
                    )}
                </ul>
            </div>
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Eliminar Flujo</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
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

export default MisFlujos;
