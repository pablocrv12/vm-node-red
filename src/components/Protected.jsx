import React, { useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Protected = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleAccessNodeRed = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post("http://localhost:3000/start-nodered", {}, {
                headers: {
                    Authorization: token
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
    }, [navigate]);

    return (
        <div>
            <h1>Contenido protegido</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
            <button onClick={handleAccessNodeRed}>Acceder a Node-RED</button>
        </div>
    );
};

export default Protected;
