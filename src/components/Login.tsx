import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
        const response = await api.post('/auth/login', { email, password });
        login(response.data.token);
        navigate('/');
    } catch (err) {
        // Este es el bloque corregido
        if (err instanceof AxiosError && err.response) {
            // Si la API nos da un mensaje de error, lo mostramos
            setError(err.response.data.message || 'Credenciales inválidas.');
        } else {
            // Si es otro tipo de error
            setError('Ocurrió un error inesperado.');
        }
    }
};

    return (
        <form onSubmit={handleSubmit}>
            <h2>Iniciar Sesión</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <br />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;