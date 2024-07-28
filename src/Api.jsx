import axios from 'axios';

const baseUrl = 'https://backend-service-3flglcef2q-ew.a.run.app/api/v1/flow';

export const getAllFlows = async () => {
  try {
    const response = await axios.get(`${baseUrl}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    throw error;
  }
};

export const getOneFlow = async (id) => {
  try {
    const response = await axios.get(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener datos de la API:', error);
    throw error;
  }
};

export const createNewFlow = async (datos) => {
  try {
    // Realiza una solicitud POST al endpoint con los datos proporcionados
    const response = await axios.post(`${baseUrl}`, datos);
    // Devuelve los datos del recurso creado si la solicitud es exitosa
    return response.data;
  } catch (error) {
    // Maneja cualquier error que ocurra durante la solicitud
    console.error('Error al crear el recurso:', error);
    throw error;
  }
};

export const updateFlow = async (id, updatedData) => {
  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el flujo:', error);
    throw error;
  }
};


export const deleteFlow = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar datos de la API:', error);
    throw error;
  }
};