import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NuevaClase = () => {
    const [className, setClassName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (token) {
            axios.post(
                'http://localhost:3000/api/v1/class', 
                { name: className }, 
                { headers: { Authorization: `${token}` } }
            )
            .then(res => {
                alert('Clase creada con éxito');
                navigate('/protected');
            })
            .catch(err => {
                console.log(err);
                alert('No se ha podido crear la clase');
                navigate('/protected');
            });
        } else {
            navigate('/login');
        }
    };

    return (
        <div>
            <h1>Crear Nueva Clase</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="className">Nombre de la Clase:</label>
                    <input
                        type="text"
                        id="className"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Crear Clase</button>
            </form>
        </div>
    );
};

export default NuevaClase;