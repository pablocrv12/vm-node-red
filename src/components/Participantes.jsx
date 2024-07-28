import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import Navbar from './Navbar';

const Participantes = () => {
    const { classId } = useParams();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [userIdToEject, setUserIdToEject] = useState(null);

    const openConfirmationModal = (userId) => {
        setUserIdToEject(userId);
        setShowConfirmationModal(true);
      };
      
      const closeConfirmationModal = () => {
        setUserIdToEject(null);
        setShowConfirmationModal(false);
      };

      const handleEjectConfirmed = () => {
        // Llamar a la API para expulsar al estudiante
        const token = localStorage.getItem('token');
        console.log(localStorage.getItem('token'))
        if(token){
            axios.patch(
                `https://backend-service-3flglcef2q-ew.a.run.app/api/v1/class/${classId}/eject/${userIdToEject}`,
                {}, // <- No hay datos para enviar, por lo que el cuerpo está vacío
                {
                    headers: {
                        Authorization: `${token}`
                    }
                }
            )
            .then(response => {
                console.log('Student ejected successfully:', response.data);
                // Cerrar el modal después de la expulsión
                closeConfirmationModal();

            })
            .catch(error => {
                console.error('Error ejecting student:', error);
                // Manejar el error si es necesario
            });
        }
        console.error('No token found');
        setLoading(false);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`https://backend-service-3flglcef2q-ew.a.run.app/api/v1/class/students/${classId}`, {
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
        } else {
            console.error('No token found');
            setLoading(false);
        }
    }, [classId]);

    const handleExpulsar = (userId) => {
        // Aquí puedes agregar la lógica para expulsar al usuario de la clase
        console.log(`Expulsando usuario con ID: ${userId}`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
        <Navbar />
        <h1 style={{ marginTop: '50px', marginBottom: '50px', fontWeight: 'bold' }}>Participantes</h1>
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
                    className="btn btn-primary"
                    style={{ marginRight: '10px' }}
                  >
                    Ver flujos
                  </button>
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
