import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
        axios.delete(`http://localhost:3000/api/v1/class/${classId}/eject/${userIdToEject}`)
          .then(response => {
            console.log('Student ejected successfully:', response.data);
            // Cerrar el modal después de la expulsión
            closeConfirmationModal();
          })
          .catch(error => {
            console.error('Error ejecting student:', error);
            // Manejar el error si es necesario
          });
      };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3000/api/v1/class/students/${classId}`, {
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
        <div>
            <h1>Participantes</h1>
            <ul>
            {participants.map(participant => (
            <div key={participant._id}>
                <p>{participant.name} - {participant.email}</p>
                <button onClick={() => openConfirmationModal(participant._id)}>Expulsar</button>
            </div>
            ))}
            </ul>
            {showConfirmationModal && (
  <div className="modal">
    <div className="modal-content">
      <h2>¿Estás seguro de querer expulsar a este participante?</h2>
      <div>
        <button onClick={handleEjectConfirmed}>Sí</button>
        <button onClick={closeConfirmationModal}>No</button>
      </div>
    </div>
  </div>
)}
        </div>
    );
};

export default Participantes;
