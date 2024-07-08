import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import Navbar from './Navbar';

const MisFlows = () => {
    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [flowIdToDelete, setFlowIdToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3000/api/v1/class/${classId}/flows`, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                setFlows(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching flows:', error);
                setError('Failed to load flows');
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [classId]);

    const handleDeleteFlow = (flowId) => {
        setFlowIdToDelete(flowId);
        setShowConfirmationModal(true);
    };

    const confirmDeleteFlow = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.delete(`http://localhost:3000/api/v1/class/${classId}/deleteFlow/${flowIdToDelete}`, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                console.log('Flow deleted successfully:', response.data);
                setShowConfirmationModal(false);
                // Actualizar la lista de flujos después de eliminar el flujo
                setFlows(flows.filter(flow => flow._id !== flowIdToDelete));
            })
            .catch(error => {
                console.error('Error deleting flow:', error);
                setShowConfirmationModal(false);
            });
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <div style={{ marginTop: '70px', textAlign: 'center' }}>
                <h1>Mis Flujos</h1>
                <ul className="list-group">
                    {flows.length > 0 ? (
                        flows.map((flow) => (
                            <li key={flow._id} className="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h2><strong>{flow.name}</strong></h2>
                                    <p>{flow.description}</p>
                                </div>
                                <div>
                                    <Button variant="danger" onClick={() => handleDeleteFlow(flow._id)}>Eliminar</Button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <div>
                            <p>No tienes flujos asignados en esta clase.</p>
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

export default MisFlows;
