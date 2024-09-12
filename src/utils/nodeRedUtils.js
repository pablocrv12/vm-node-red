
import axios from 'axios';

export const handleAccessNodeRed = async (setLoading) => {
    const token = localStorage.getItem('token');
    try {
        setLoading(true);

        const response = await axios.post("https://backend-service-830425129942.europe-west1.run.app/api/v1/node/start-nodered", {}, {
            headers: {
                Authorization: `${token}`
            }
        });

        if (response.data.success) {
            window.location.href = response.data.url;
        } else {
            alert("Error al iniciar Node-RED");
        }
    } catch (error) {
        console.error("Error al acceder a Node-RED:", error);
        alert("Error al iniciar Node-RED");
    } finally {
        setLoading(false);
    }
};
