import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



const comprobarJWT = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = parseJwt(token);
      const isExpired = Date.now() >= decodedToken.exp * 1000;

      if (isExpired) {
        alert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
        localStorage.removeItem('token');
        navigate('/login'); // Redirige al usuario a la página de login si el token ha expirado
      }
    } else {
      navigate('/login'); // Redirige al usuario a la página de login si no existe un token
    }
  }, [navigate]);
};

// Función para decodificar el JWT
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error parsing JWT:', error);
        return null;
    }
}

export default comprobarJWT;
