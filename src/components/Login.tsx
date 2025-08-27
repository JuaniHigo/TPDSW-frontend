import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Importar useLocation
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';
import AuthLayout from './AuthLayout';
import './AuthForm.css';
import loginBackground from '../assets/hincha.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation(); // 2. Obtener la información de la ubicación

    // 3. Definimos a dónde debe ir el usuario después del login.
    // Si el 'state' tiene una ruta 'from', la usamos. Si no, va a la Home.
    const from = location.state?.from || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token);
            // 4. Usamos la ruta 'from' para la redirección
            navigate(from, { replace: true });
        } catch (err) {
            if (err instanceof AxiosError && err.response) {
                setError(err.response.data.message || 'El DNI o contraseña ingresados son incorrectos.');
            } else {
                setError('Ocurrió un error inesperado.');
            }
        }
    };

    return (
        <AuthLayout 
            title={<>DEJANDO LA<br/>VIDA POR LOS<br/>COLORES</>}
            imageUrl={loginBackground}
        >
            <div className="auth-form-card">
                <p className="auth-switch-link">¿No tenés cuenta? <Link to="/register" className="auth-link">Registrate</Link></p>
                <h2>INGRESAR A MI CUENTA</h2>
                <form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="auth-input"
                        />
                    </div>
                    <div className="auth-input-group">
                        <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Ingresar contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="auth-input"
                        />
                        <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : 
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            }
                        </button>
                    </div>
                    <div className="auth-options">
                        <div/>
                        <Link to="/forgot-password" className="auth-link">Olvidé mi contraseña</Link>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="auth-submit-button">
                        Iniciar sesión
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;