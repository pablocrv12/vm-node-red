import React, { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

export const Login = (props) => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
      const token = localStorage.getItem('token');
      axios.get("http://localhost:3000/Protected", {
          headers: {
              Authorization: token
          } 
      }).then(res => {
          console.log(res);
          navigate('/protected')
          }).catch(err => {
          console.log(err);
          navigate('/login')
          })
  },[])

    const submit = () => {
        console.log(email, password)
        axios.post("http://localhost:3000/login", {email, password}).then(user => { 
        console.log(user);
        localStorage.setItem('token', user.data.token)
        }).catch(err => {
        console.log(err);
        })
    }

    return (
        <div className="auth-form-container">
            <h2>Login</h2>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@uma.es" id="email" name="email" />
                <label htmlFor="password">password</label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                <button onClick={submit}>Log In</button>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
    )
}

export default Login;