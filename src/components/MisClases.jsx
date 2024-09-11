import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Alert } from 'react-bootstrap';
import Navbar from './Navbar';
import checkAuth from './checkAuth';
import '../../css/Spinner.css';

const MisClases = () => {
    checkAuth();

    const [createdClasses, setCreatedClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleUser, setRoleUser] = useState('');
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [classIdToDelete, setClassIdToDelete] = useState(null);
    const [classIdToLeave, setClassIdToLeave] = useState('');
    const [userId, setUserId] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Estado para el mensaje de éxito
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
                axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/rol/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                })
                .then(res => {
                    setRoleUser(res.data.data.role);
                    if (res.data.data.role === 'student') {
                        axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/joinedclasses/${decodedToken.id}`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        })
                        .then(response => {
                            setJoinedClasses(response.data.data);
                            setLoading(false);
                        })
                        .catch(error => {
                            console.error('Error fetching joined classes:', error);
                            setLoading(false);
                            setError('Failed to load joined classes');
                        });
                    } else {
                        axios.get(`https://backend-service-830425129942.europe-west1.run.app/api/v1/user/createdclasses/${decodedToken.id}`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        })
                        .then(response => {
                            setCreatedClasses(response.data.data);
                            setLoading(false);
                        })
                        .catch(err => {
                            console.error('Error fetching created classes:', err);
                            setLoading(false);
                            setError('Failed to load created classes');
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    navigate('/login');
                });
            } else {
                console.error('User ID not found in token');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

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

    const handleAccessClass = (classId) => {
        navigate(`/clase/${classId}`);
    };

    const handleDeleteClass = async (classId) => {
        setClassIdToDelete(classId);
        setShowConfirmationModal(true);
    };

    const confirmDeleteClass = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/v1/class/${classIdToDelete}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setCreatedClasses(createdClasses.filter(clase => clase._id !== classIdToDelete));
            setSuccessMessage('Clase eliminada correctamente'); // Mensaje de éxito para eliminación
            setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
        } catch (error) {
            console.error('Error deleting class:', error);
        }
        setShowConfirmationModal(false);
    };

    const handleLeaveClass = (classId) => {
        setClassIdToLeave(classId);
        setShowConfirmationModal(true);
    };

    const confirmLeaveClass = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.patch(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/${classIdToLeave}/leave/${userId}`, null, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setJoinedClasses(joinedClasses.filter(clase => clase._id !== classIdToLeave));
            setSuccessMessage('Has abandonado la clase correctamente'); // Mensaje de éxito para abandono
            setTimeout(() => setSuccessMessage(''), 3000); // Limpia el mensaje después de 3 segundos
        } catch (error) {
            console.error('Error leaving class:', error);
        }
        setShowConfirmationModal(false);
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <div className="spinner"></div>
                <p>Cargando tus clases...</p>
            </div>
        );
    }

    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <div style={{ marginTop: '70px', textAlign: 'center' }}>
                <h1>Tus clases</h1>
                {successMessage && <Alert variant="success">{successMessage}</Alert>} {/* Mostrar mensaje de éxito */}
                {roleUser === 'professor' && (
                    <ul className="list-group">
                        {createdClasses.length > 0 ? (
                            createdClasses.map((clase) => (
                                <li key={clase._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2><strong>{clase.name}</strong></h2>
                                        <p>Número de participantes: {clase.students.length}</p>
                                    </div>
                                    <div>
                                        <Button variant="primary" onClick={() => handleAccessClass(clase._id)}>Acceder</Button>{' '}
                                        <Button variant="danger" onClick={() => handleDeleteClass(clase._id)}>Eliminar Clase</Button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div>
                                <p>Todavía no has creado ninguna clase.</p>
                            </div>
                        )}
                    </ul>
                )}
                {roleUser === 'student' && (
                    <ul className="list-group">
                        {joinedClasses.length > 0 ? (
                            joinedClasses.map((clase) => (
                                <li key={clase._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2><strong>{clase.name}</strong></h2>
                                        <p>Número de participantes: {clase.students.length}</p>
                                    </div>
                                    <div>
                                        <Button variant="primary" onClick={() => handleAccessClass(clase._id)}>Acceder</Button>{' '}
                                        <Button variant="danger" onClick={() => handleLeaveClass(clase._id)}>Abandonar</Button>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <div>
                                <p>Todavía no te has unido a ninguna clase</p>
                            </div>
                        )}
                    </ul>
                )}
            </div>
            <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)}>
                <Modal.Header closeButton>
                    {roleUser === 'professor' ? (
                        <Modal.Title style={{ textAlign: 'center' }}>Eliminar clase</Modal.Title>
                    ) : (
                        <Modal.Title style={{ textAlign: 'center' }}>Abandonar clase</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body style={{ textAlign: 'center' }}>
                    ¿Estás seguro de que quieres realizar esta acción?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmationModal(false)}>Cancelar</Button>
                    {roleUser === 'professor' ? (
                        <Button variant="danger" onClick={confirmDeleteClass}>Confirmar</Button>
                    ) : (
                        <Button variant="danger" onClick={confirmLeaveClass}>Confirmar</Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MisClases;
