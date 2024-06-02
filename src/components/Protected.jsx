import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

const Protected = () => {
    const navigate = useNavigate();
    const [roleUser, setRoleUser] = useState('');
    const [userId, setUserId] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [classLink, setClassLink] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleAccessNodeRed = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post("http://localhost:3000/start-nodered", {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            console.log(response.data);
            if (response.data.success) {
                window.location.href = `http://localhost:1880`;
            } else {
                alert("Error al iniciar Node-RED");
            }
        } catch (error) {
            console.error("Error al acceder a Node-RED:", error);
            alert("Error al iniciar Node-RED");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = parseJwt(token);
            console.log('Decoded Token:', decodedToken); // Para verificar el contenido del token
            if (decodedToken && decodedToken.id) {
                setUserId(decodedToken.id);
                axios.get(`http://localhost:3000/api/v1/user/rol/${decodedToken.id}`, {
                    headers: {
                        Authorization: `${token}`
                    } 
                })
                .then(res => {
                    // Aquí cogemos el rol del usuario
                    setRoleUser(res.data.data.role);
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

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setClassLink('');
    };

    const handleClassLinkChange = (event) => {
        setClassLink(event.target.value);
    };

    const handleJoinClass = async () => {
        const token = localStorage.getItem('token');

        if (!classLink) {
            alert('Por favor, introduce el enlace de la clase');
            return;
        }

        try {
            const response = await axios.post(classLink, {}, {
                headers: {
                    Authorization: `${token}`
                }
            });
            if (response.status === 200) {
                alert('Te has unido a la clase exitosamente');
                closeModal();
                // Aquí puedes añadir lógica adicional si es necesario, como redireccionar a la página de la clase
            } else {
                alert('Error al unirse a la clase');
            }
        } catch (error) {
            console.error('Error al unirse a la clase:', error);
            alert('Error al unirse a la clase');
        }
    };

    return (
        <div>
            <h1>Contenido protegido</h1>
            <p>Hola, {roleUser}</p>
            {roleUser === 'professor' && (
                <button onClick={() => navigate('/NuevaClase')}>Nueva Clase</button>
            )}
            {roleUser === 'student' && (
                <button onClick={openModal}>Unirse a una clase</button>
            )}
            <button onClick={() => navigate('/MisClases')}>Mis Clases</button>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={handleAccessNodeRed}>Acceder a Node-RED</button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Unirse a una clase"
                ariaHideApp={false} // Asegúrate de que esto esté configurado correctamente
            >
                <h2>Unirse a una clase</h2>
                <input 
                    type="text" 
                    value={classLink} 
                    onChange={handleClassLinkChange} 
                    placeholder="Introduce el enlace de la clase"
                />
                <button onClick={handleJoinClass}>Aceptar</button>
                <button onClick={closeModal}>Cancelar</button>
            </Modal>
        </div>
    );
};

export default Protected;
