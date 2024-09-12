import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Container, Row, Col, Button, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import comprobarJWT from './comprobarJWT';

const Participantes = () => {

    comprobarJWT();

    const { classId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userIdToEject, setUserIdToEject] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const openConfirmationModal = (userId) => {
        setUserIdToEject(userId);
        setShowConfirmationModal(true);
    };
      
    const closeConfirmationModal = () => {
        setUserIdToEject(null);
        setShowConfirmationModal(false);
    };

    const handleEjectConfirmed = () => {
        const token = localStorage.getItem('token');
        if(token){
            axios.patch(
                `https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classId}/eject/${userIdToEject}`,
                {}, 
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            )
            .then(response => {
                console.log('Student ejected successfully:', response.data);
                closeConfirmationModal();
                setParticipants(participants.filter(participant => participant._id !== userIdToEject));
                setSuccessMessage('Participante expulsado con éxito');
                setTimeout(() => setSuccessMessage(''), 3000);
            })
            .catch(error => {
                console.error('Error ejecting student:', error);
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const loadTimer = setTimeout(() => {
                axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/students/${classId}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(response => {
                    setParticipants(response.data.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching participants:', error);
                    setError('Failed to load participants');
                    setLoading(false);
                });
            }, 1000);

            return () => clearTimeout(loadTimer);
        } else {
            console.error('No token found');
            setLoading(false);
        }
    }, [classId]);

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
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
        <Navbar />
        <h1 style={{ marginTop: '60px', marginBottom: '50px', fontWeight: 'bold' }}>Participantes</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>} {}
        {participants.length === 0 ? (
          <p>Todavía no hay ningún participante.</p>
        ) : (
          <ul>
            {participants.map(participant => (
              <div key={participant._id} className="d-flex justify-content-between align-items-center">
                <div style={{ textAlign: 'left' }}>
                  <h4>{participant.name}</h4>
                </div>
                <div style={{ textAlign: 'center', flex: '1' }}>
                  <h4>{participant.email}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => openConfirmationModal(participant._id)}
                    className="btn btn-danger"
                    style={{ marginRight: '10px' }}
                  >
                    Expulsar
                  </button>
                </div>
              </div>
            ))}
          </ul>
        )}
        {showConfirmationModal && (
          <Modal show={showConfirmationModal} onHide={closeConfirmationModal}>
            <Modal.Header closeButton>
              <Modal.Title style={{ textAlign: 'center' }}>¿Estás seguro de querer expulsar a este participante?</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: 'center' }}>
              <p>Estás a punto de expulsar a un participante. Esta acción no se puede deshacer.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeConfirmationModal}>Cancelar</Button>
              <Button variant="danger" onClick={handleEjectConfirmed}>Expulsar</Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    );
};

export default Participantes;
