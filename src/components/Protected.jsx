import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Protected = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Eliminar el token del localStorage
        localStorage.removeItem('token');
    
        // Redirigir al usuario a la página principal
        navigate('/');
    };
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get("http://localhost:3000/protected", {
            headers: {
                Authorization: token
            } 
        })
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
    }, []);

    return (
        <div>
            <h1>Contenido protegido</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
};

export default Protected;