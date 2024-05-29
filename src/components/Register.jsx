import React, { useState, useEffect } from "react";

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('user'); // Estado para el rol
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        // Check if all fields are filled
        if (email && pass && name && role) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [email, pass, name, role]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password: pass, role, name })
        });

        const result = await response.json();
        if (result.success) {
            alert('User registered successfully');
        } else {
            alert('Error: ' + result.message);
        }

        console.log(email, pass, role, name);
    }

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
            <form className="register-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Nombre completo</label>
                <input
                    value={name}
                    name="name"
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    placeholder="Full Name"
                    required
                />
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
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    type="password"
                    placeholder="********"
                    id="password"
                    name="password"
                    required
                />
                <label htmlFor="role">Role:</label>
                <select
                    name="role"
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                >
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                    <option value="professor">Professor</option>
                    <option value="user">User</option>
                </select>
                <button type="submit" disabled={!isFormValid}>Register</button>
            </form>
            <button className="link-btn" onClick={() => navigate('/login')}>Already have an account? Login here.</button>
        </div>
    );
}

export default Register;