import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const gotToNewPage=()=>{
    navigate("/login");
  }



  return (
    <div className="navbar">
      <div className="logo">
        <img src="../public/Node-RED.svg" alt="Logo de la App" />
      </div>
      <div className="buttons">
        <button onClick={() => gotToNewPage()}>Iniciar sesión</button>
        <button onClick={() => gotToNewPage()}>Registrarse</button>
      </div>
    </div>
  );
}

export default Navbar;