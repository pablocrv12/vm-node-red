import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MisClases = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [roleUser, setRoleUser] = useState('');
    const [joinedClasses, setJoinedClasses] = useState([]);
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
                axios.get(`http://localhost:3000/api/v1/user/rol/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    } 
                })
                .then(res => {
                    setRoleUser(res.data.data.role);
                    setLoading(false);
                    if (res.data.data.role === 'student') {
                        axios.get(`http://localhost:3000/api/v1/user/classes/${decodedToken.id}`, {
                            headers: {
                                Authorization: `${token}`
                            }
                        })
                        .then(response => {
                            setJoinedClasses(response.data.data);
                        })
                        .catch(error => {
                            console.error('Error fetching joined classes:', error);
                        });
                    } else {
                        axios.get('http://localhost:3000/api/v1/class', {
                            headers: {
                                Authorization: `${token}`
                            }
                        })
                        .then(response => {
                            setClasses(response.data.data);
                        })
                        .catch(err => {
                            console.error('Error fetching classes:', err);
                            setError('Failed to load classes');
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
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/v1/class/${classId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setClasses(classes.filter(clase => clase._id !== classId));
        } catch (error) {
            console.error('Error deleting class:', error);
        }
    };

    const handleLeaveClass = async (classId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/api/v1/class/leave/${classId}`, {
                headers: {
                    Authorization: `${token}`
                }
            });
            setJoinedClasses(joinedClasses.filter(clase => clase._id !== classId));
        } catch (error) {
            console.error('Error leaving class:', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Class List</h1>
            {roleUser === 'professor' && (
                <ul>
                    {classes.map((clase) => (
                        <li key={clase._id}>
                            <h2>{clase.name}</h2>
                            <p>Número de participantes: {clase.students.length}</p>
                            <button onClick={() => handleAccessClass(clase._id)}>Acceder</button>
                            <button onClick={() => handleDeleteClass(clase._id)}>Eliminar Clase</button>
                        </li>
                    ))}
                </ul>
            )}
            {roleUser === 'student' && (
                <ul>
                    {joinedClasses.map((clase) => (
                        <li key={clase._id}>
                            <h2>{clase.name}</h2>
                            <p>Número de participantes: {clase.students.length}</p>
                            <button onClick={() => handleAccessClass(clase._id)}>Acceder</button>
                            <button onClick={() => handleLeaveClass(clase._id)}>Abandonar</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MisClases;
