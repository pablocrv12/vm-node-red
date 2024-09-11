import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Modal, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import checkAuth from './checkAuth';

const SubirFlujo = () => {
    checkAuth();

    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [flowIdToUpload, setFlowIdToUpload] = useState(null);
    const [flowIdToCancel, setFlowIdToCancel] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [uploadedFlows, setUploadedFlows] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (token) {
            const decodedToken = parseJwt(token);
            // Fetch all available flows
            axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/flows/${decodedToken.id}`, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                setFlows(response.data.data);
                // Fetch all flows already uploaded to the class
                return axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/AllFlows`, {
                    headers: { Authorization: `${token}` }
                });
            })
            .then(response => {
                const uploadedFlows = response.data.data;
                setUploadedFlows(uploadedFlows);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError('Failed to load data');
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [classId]);

    const handleUploadFlow = (flowId) => {
        setFlowIdToUpload(flowId);
        setShowConfirmationModal(true);
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

    const confirmUploadFlow = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/uploadFlow/${flowIdToUpload}`, null, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                console.log('Flow uploaded successfully:', response.data);
                setShowConfirmationModal(false);
                setSuccessMessage('Se ha entregado correctamente');
                setUploadedFlows(prevUploadedFlows => [...prevUploadedFlows, { _id: flowIdToUpload }]);
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            })
            .catch(error => {
                console.error('Error uploading flow:', error);
                setShowConfirmationModal(false);
            });
        }
    };

    const handleCancelDelivery = (flowId) => {
        setFlowIdToCancel(flowId);
        setShowCancelModal(true); // Show cancel confirmation modal
    };

    const confirmCancelDelivery = () => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.patch(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/deleteFlow/${flowIdToCancel}`, null, {
                headers: { Authorization: `${token}` }
            })
            .then(response => {
                console.log('Flow delivery cancelled successfully:', response.data);
                setUploadedFlows(prevUploadedFlows => prevUploadedFlows.filter(flow => flow._id !== flowIdToCancel)); // Remove flow from state
                setShowCancelModal(false);
                setSuccessMessage('Entrega cancelada correctamente');
                setTimeout(() => setSuccessMessage(''), 3000); // Clear success message after 3 seconds
            })
            .catch(error => {
                console.error('Error cancelling flow delivery:', error);
                setShowCancelModal(false);
            });
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
                                            <>
                                                <Button variant="danger" onClick={() => handleCancelDelivery(flow._id)} style={{ marginRight: '10px' }}>Cancelar Entrega</Button>
                                                <Button variant="secondary" disabled>Entregado</Button>
                                            </>
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
            <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center' }}>Cancelar Entrega</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    ¿Estás seguro de que quieres cancelar la entrega de este flujo?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={confirmCancelDelivery}>Confirmar</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SubirFlujo;
