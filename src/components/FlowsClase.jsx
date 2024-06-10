import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import Navbar from './Navbar';

const FlowsClase = () => {
    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [flowIdToDelete, setFlowIdToDelete] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3000/api/v1/class/${classId}/flows`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(async (response) => {
                const flowsData = response.data.data;
                for (const flow of flowsData) {
                    try {
                        const userResponse = await axios.get(`http://localhost:3000/api/v1/flow/user/${flow._id}`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        });
                        const userData = userResponse.data.data; // Assuming user data is returned as an object containing name and email
                        flow.user = userData; // Assigning user data to flow.user
                    } catch (error) {
                        console.error('Error fetching user details:', error);
                        flow.user = { name: 'Unknown', email: 'Unknown' }; // Default values if user data cannot be fetched
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
        } else {
            setError('No token found');
            setLoading(false);
        }
    }, [classId]);

    const handleDeleteFlow = (flowId) => {
        setFlowIdToDelete(flowId);
        setShowConfirmationModal(true);
    };

    const confirmDeleteFlow = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.delete(`http://localhost:3000/api/v1/class/${classId}/deleteFlow/${flowIdToDelete}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                setFlows(flows.filter(flow => flow._id !== flowIdToDelete));
            }
            setShowConfirmationModal(false);
        } catch (error) {
            console.error('Error deleting flow:', error);
            setShowConfirmationModal(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <h1 className="text-center mt-3 mb-4 font-weight-bold">Flows List</h1>
            {flows.length > 0 ? (
                flows.map((flow) => (
                    <Row key={flow._id} className="mb-3">
                        <Col xs={4}>
                            <h2 className="font-weight-bold pl-3">{flow.name}</h2>
                        </Col>
                        <Col xs={4} className="text-center">
                            <p>{flow.user.name} - {flow.user.email}</p> {/* Displaying user name and email in the same line */}
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end pr-3">
                            <Button variant="danger" onClick={() => handleDeleteFlow(flow._id)}>Eliminar</Button>
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
