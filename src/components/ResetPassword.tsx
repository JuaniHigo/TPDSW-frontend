import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';
import { AxiosError } from 'axios'; // Importar AxiosError

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post(`/auth/reset-password/${token}`, { password });
            setMessage(response.data.message);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            // Corregir manejo de error
            if (err instanceof AxiosError && err.response) {
                setMessage(err.response.data.message || 'El token podría ser inválido o ha expirado.');
            } else {
                setMessage('Ocurrió un error inesperado.');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Ingresá tu Nueva Contraseña</h2>
                {message ? (
                    <p>{message}</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="password">Nueva Contraseña</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button">Actualizar Contraseña</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;