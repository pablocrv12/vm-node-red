import React, { useState, useEffect } from 'react';
import './App.css';
import { getOneFlow } from './Api';

export function useGetAllFlows(){
    const [datos, setDatos] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const datosObtenidos = await getAllFlows(); // Llama al método obtenerDatos
          setDatos(datosObtenidos.data); // Actualiza el estado con los datos obtenidos
          console.log('Datos obtenidos de la API:', datos);
        } catch (error) {
          console.error('Error al obtener datos:', error);
        }
      };
  
      fetchData(); // Llama a la función fetchData al montar el componente
    }, []);

    return datos;
}

/*
 return (
    <div>
      <Navbar />
      <h1>Datos obtenidos de la API:</h1>
      <ul>
        {datos.map((dato, index) => (
          <li key={index}>
            <p>Name: {dato.name}</p>
            <p>Description: {dato.description}</p>
            <p>Creation Date: {dato.creation_date}</p>
            <p>Last Update: {dato.last_update}</p>
            <p>User ID: {dato.userId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
  */

export function useGetOneFlow(initialId) {
        const [dato, setDato] = useState(null); // Estado para almacenar el dato obtenido
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const datoObtenido = await getOneFlow(initialId); // Llama al método getOneFlow con el id inicial
              setDato(datoObtenido.data); // Actualiza el estado con el dato obtenido
              console.log('Dato obtenido de la API:', datoObtenido.data);
            } catch (error) {
              console.error('Error al obtener dato:', error);
            }
          };
        
          fetchData(); // Llama a la función fetchData al montar el componente
        }, [initialId]); // Agrega initialId como una dependencia para que se vuelva a ejecutar si cambia
      
        return dato; // Devuelve el dato obtenido
      }
/*
  return (
    <div>
      <Navbar />
      <h1>Datos obtenidos de la API:</h1>
      {dato && (
        <ul>
          <li>
            <p>Name: {dato.name}</p>
            <p>Description: {dato.description}</p>
            <p>Creation Date: {dato.creation_date}</p>
            <p>Last Update: {dato.last_update}</p>
            <p>User ID: {dato.userId}</p>
          </li>
        </ul>
      )}
    </div>
  );
  */

  export function useCreateNewFlow(){
    const [datosNuevoRecurso, setDatosNuevoRecurso] = useState({
        name: 'pre',
        description: 'prueba react',
        userId: 'll'
      });
    
      const handleCrearRecurso = () => {
        createNewFlow(datosNuevoRecurso)
          .then((nuevoRecurso) => {
            console.log('Recurso creado con éxito:', nuevoRecurso);
            // Realiza cualquier acción adicional necesaria después de crear el recurso
          })
          .catch((error) => {
            console.error('Error al crear el recurso:', error);
            // Maneja el error según sea necesario
          });
      };
  }
/*
  return (
    <div>
      <Navbar />
      <button onClick={handleCrearRecurso}>Crear Nuevo Recurso</button>
    </div>
  );
  */

  export function useUpdateFlow(id){
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
  }

  /*
    return (
    <div>
      <Navbar />
      <button onClick={handleActualizarRecurso}>Actualizar Recurso</button>
    </div>
  );
  */

  export function useDeleteFlow(id) {
    return async () => {
      try {
        const response = await deleteFlow(id); // Llama al método deleteFlow con el ID del flujo a eliminar
        console.log('Flujo eliminado correctamente:', response);
        // Realiza cualquier acción adicional después de la eliminación, si es necesario
      } catch (error) {
        console.error('Error al eliminar el flujo:', error);
        // Maneja el error según sea necesario
      }
    };
  }

  /*
   return (
       
        <button onClick={() => handleEliminar('65eb35920c39baee613d8c74')}>Eliminar Flujo</button>
      );
  */