import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import './App.css';
import { updateFlow } from './Api';

function App() {
  const [datosActualizados, setDatosActualizados] = useState({
    id: '65eb33220c39baee613d8c6c', // ID del recurso a actualizar
    name: 'Nuevo nombre',
    description: 'Nueva descripción',
    userId: 'Nuevo usuario'
  });

  const handleActualizarRecurso = () => {
    updateFlow(datosActualizados.id, datosActualizados)
      .then((recursoActualizado) => {
        console.log('Recurso actualizado con éxito:', recursoActualizado);
        // Realiza cualquier acción adicional necesaria después de actualizar el recurso
      })
      .catch((error) => {
        console.error('Error al actualizar el recurso:', error);
        // Maneja el error según sea necesario
      });
  };

  return (
    <div>
      <Navbar />
      <button onClick={handleActualizarRecurso}>Actualizar Recurso</button>
    </div>
  );
}

export default App;