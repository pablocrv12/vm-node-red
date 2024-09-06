
import axios from 'axios';

export const handleAccessNodeRed = async (setLoading) => {
    const token = localStorage.getItem('token');
    try {
        // Mostrar el spinner de carga
        setLoading(true);

        const response = await axios.post("https://backend-service-830425129942.europe-west1.run.app/start-nodered", {}, {
            headers: {
                Authorization: `${token}` // Asegúrate de que el token está en el formato correcto
            }
        });

        if (response.data.success) {
            // Redirigir al usuario a la URL de la instancia de Node-RED
            window.location.href = response.data.url;
        } else {
            alert("Error al iniciar Node-RED");
        }
    } catch (error) {
        console.error("Error al acceder a Node-RED:", error);
        alert("Error al iniciar Node-RED");
    } finally {
        // Ocultar el spinner de carga
        setLoading(false);
    }
};
