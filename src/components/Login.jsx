import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook para navegación

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post("http://localhost:3000/login", { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token); // Almacenar token en localStorage
            navigate('/protected'); // Redirigir a la ruta protegida
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            // Manejar el error de inicio de sesión aquí
        }
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email</label>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="xxx@uma.es"
                    id="email"
                    name="email"
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="********"
                    id="password"
                    name="password"
                    required
                />
                <button type="submit">Login</button>
            </form>
            <button className="link-btn" onClick={() => navigate('/register')}>Don't have an account? Register here.</button>
        </div>
    );
}

export default Login;
