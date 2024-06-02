import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const FlowsClase = () => {
    const { classId } = useParams();
    const [flows, setFlows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.get(`http://localhost:3000/api/v1/class/${classId}/flows`, {
                headers: {
                    Authorization: `${token}`
                }
            })
            .then(response => {
                setFlows(response.data.data);
                setLoading(false);

                // Fetch user details for each flow
                response.data.data.forEach(flow => {
                    axios.get(`http://localhost:3000/api/v1/user/${flow.userId}`, {
                        headers: {
                            Authorization: `${token}`
                        }
                    })
                    .then(res => {
                        setUsers(prevUsers => ({
                            ...prevUsers,
                            [flow.userId]: res.data.data.name
                        }));
                    })
                    .catch(err => {
                        console.error('Error fetching user details:', err);
                    });
                });
            })
            .catch(err => {
                console.error('Error fetching flows:', err);
                setError('Failed to load flows');
                setLoading(false);
            });
        } else {
            setError('No token found');
            setLoading(false);
        }
    }, [classId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Flows List</h1>
            <ul>
                {flows.map((flow) => (
                    <li key={flow._id}>
                        <h2>{flow.name}</h2>
                        <h2>{users[flow.userId] || 'Loading user...'}</h2>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FlowsClase;
