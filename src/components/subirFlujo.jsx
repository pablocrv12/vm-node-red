import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal, Alert } from 'react-bootstrap';
import Navbar from './Navbar';

const SubirFlujo = () => {
    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [flowIdToUpload, setFlowIdToUpload] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadedFlows, setUploadedFlows] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3000/api/v1/flow`, {
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
    
            Promise.all(flows.map(flow => {
                return axios.get(`http://localhost:3000/api/v1/flow/classes/${flow._id}`, {
                    headers: { Authorization: `${token}` }
                });
            })).then(responses => {
                const uploadedFlows = responses.map(response => response.data.data).filter(data => data.length > 0);
                setUploadedFlows(uploadedFlows);
            }).catch(error => {
                console.error('Error fetching uploaded flows:', error);
            });
        } else {
            setLoading(false);
        }
    }, []);

    const handleUploadFlow = (flowId) => {
        setFlowIdToUpload(flowId);
        setShowConfirmationModal(true);
    };

    const confirmUploadFlow = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`http://localhost:3000/api/v1/class/${classId}/uploadFlow/${flowIdToUpload}`, null, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                console.log('Flow uploaded successfully:', response.data);
                setShowConfirmationModal(false);
                setSuccessMessage('Se ha entregado correctamente');
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            })
            .catch(error => {
                console.error('Error uploading flow:', error);
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
                <h1>Subir Flujos</h1>
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <ul className="list-group">
                    {flows.length > 0 ? (
                        flows.map((flow) => {
                            const uploaded = uploadedFlows.some(uploadedFlow => uploadedFlow._id === flow._id);
                            return (
                                <li key={flow._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2><strong>{flow.name}</strong></h2>
                                        <p>{flow.description}</p>
                                    </div>
                                    <div>
                                        {uploaded ? (
                                            <Button variant="secondary" disabled>Entregado</Button>
                                        ) : (
                                            <Button variant="primary" onClick={() => handleUploadFlow(flow._id)}>Entregar</Button>
                                        )}
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <div>
                            <p>No hay flujos disponibles.</p>
                        </div>
                    )}
                </ul>
            </div>
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Entregar Flujo</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    ¿Estás seguro de que quieres entregar este flujo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={confirmUploadFlow}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SubirFlujo;
