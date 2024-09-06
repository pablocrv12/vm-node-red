// JoinClass.js
import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import checkAuth from './checkAuth';

const JoinClass = () => {

    checkAuth();
    
    const { classId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const joinClass = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener el token del localStorage
                console.log("token" + token)
                if (!token) {
                    alert('You must be logged in to join the class');
                    return;
                }

                const config = { headers: { Authorization: `${token}` } };
                const response = await axios.post(`https://backend-service-830425129942.europe-west1.run.app/api/v1/class/join/${classId}`, {}, config);

                if (response.status === 200) {
                    alert('Successfully joined the class');
                    navigate(`/clase/${classId}`);
                } else {
                    alert('Failed to join the class');
                }
            } catch (error) {
                console.error('Error joining class:', error);
                alert('Error joining the class');
            }
        };

        joinClass();
    }, [classId, navigate]);


    return (
        <Container className="d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className="mb-4">Joining class...</h1>
            <div className="mb-4">
                <Button color="primary" size="lg" className="mr-3">Join</Button>
                <Button color="secondary" size="lg">Cancel</Button>
            </div>
        </Container>
    );
};

export default JoinClass;
