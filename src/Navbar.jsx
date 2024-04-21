import React from 'react';
import '../css/Navbar.css'; // Importa tu archivo CSS para estilizar la barra de navegación

const Navbar = () => {
  return (
    <div className="navbar">
     <div className="logo">
        <img src="../public/Node-RED.svg" alt="Logo de la App" />
      </div>
      <div className="buttons">
        <button>Iniciar sesión</button>
        <button>Registro</button>
      </div>
    </div>
  );
}

export default Navbar;