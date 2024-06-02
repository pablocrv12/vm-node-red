import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const InvitacionClase = ({ className }) => {
    const [emails, setEmails] = useState('');
    const { classId } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const recipientEmails = emails.split(',').map(email => email.trim());
        try {
            await axios.post('http://localhost:3000/api/v1/class/send-invite', { recipientEmails, className, classId });
            alert('Invitations sent successfully');
        } catch (error) {
            console.error('Error sending invitations:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>
            Student Emails (comma separated):
            <textarea rows="8" cols="40" value={emails} onChange={(e) => setEmails(e.target.value)} required />
        </label>
        <button type="submit">Send Invites</button>
    </form>
    
    );
};

export default InvitacionClase;