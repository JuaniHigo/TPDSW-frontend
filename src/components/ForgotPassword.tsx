import React, { useState } from 'react';
import api from '../services/api';
import './Login.css';
import { AxiosError } from 'axios'; // Importar AxiosError

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
        } catch (err) {
            // Corregir manejo de error
            if (err instanceof AxiosError && err.response) {
                setMessage(err.response.data.message || 'Ocurrió un error al enviar el email.');
            } else {
                setMessage('Ocurrió un error inesperado.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Recuperar Contraseña</h2>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p>Ingresá tu email y te enviaremos un enlace para recuperar tu contraseña.</p>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Enviar</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;