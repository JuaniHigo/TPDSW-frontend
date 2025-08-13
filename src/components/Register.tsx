import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AxiosError } from 'axios';
import AuthLayout from './AuthLayout';
import './AuthForm.css';
import registerBackground from '../assets/images.jpg'; // Asegúrate de tener esta imagen
import Modal from './Modal'; // 1. Importar el componente Modal

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [showSuccessModal, setShowSuccessModal] = useState(false); // 2. Estado para el modal
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.dni) newErrors.dni = "El DNI es obligatorio.";
        if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
        if (!formData.apellido) newErrors.apellido = "El apellido es obligatorio.";
        if (!formData.email) newErrors.email = "El email es obligatorio.";
        if (!formData.password) newErrors.password = "La contraseña es obligatoria.";
        if (!confirmPassword) newErrors.confirmPassword = "Debes confirmar la contraseña.";
        
        if (formData.password !== confirmPassword && confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            const firstErrorField = formRef.current?.querySelector('.input-error');
            firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        try {
            await api.post('/auth/register', formData);
            setShowSuccessModal(true); // 3. Mostrar el modal en lugar del alert
        } catch (err) {
            if (err instanceof AxiosError && err.response?.data) {
                if (err.response.data.errors) {
                    const apiErrors = err.response.data.errors;
                    const formattedErrors: { [key: string]: string } = {};
                    for (const key in apiErrors) {
                        if (apiErrors[key]) {
                            formattedErrors[key.replace('body.', '')] = apiErrors[key][0];
                        }
                    }
                    setErrors(formattedErrors);
                } else {
                    const errorMessage = err.response.data.message || 'Error en el registro.';
                    if (errorMessage.includes('DNI')) {
                        setErrors({ dni: errorMessage });
                    } else if (errorMessage.includes('email')) {
                        setErrors({ email: errorMessage });
                    } else {
                        setErrors({ api: errorMessage });
                    }
                }
            } else {
                setErrors({ api: 'Ocurrió un error inesperado.' });
            }
        }
    };

    return (
        <>
            <AuthLayout 
                title={<>UNITE A LA<br/>PASIÓN MÁS<br/>GRANDE</>}
                imageUrl={registerBackground}
            >
                <div className="auth-form-card">
                    <p className="auth-switch-link">¿Ya tenés cuenta? <Link to="/login" className="auth-link">Iniciá Sesión</Link></p>
                    <h2>CREAR UNA CUENTA</h2>
                    <form onSubmit={handleSubmit} ref={formRef} noValidate>
                        <div className="auth-input-group">
                            <input type="text" name="dni" placeholder="DNI" onChange={handleChange} className={`auth-input ${errors.dni ? 'input-error' : ''}`} style={{paddingLeft: '1rem'}}/>
                            {errors.dni && <p className="field-error-message">{errors.dni}</p>}
                        </div>
                        <div className="auth-input-group">
                            <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} className={`auth-input ${errors.nombre ? 'input-error' : ''}`} style={{paddingLeft: '1rem'}}/>
                            {errors.nombre && <p className="field-error-message">{errors.nombre}</p>}
                        </div>
                        <div className="auth-input-group">
                            <input type="text" name="apellido" placeholder="Apellido" onChange={handleChange} className={`auth-input ${errors.apellido ? 'input-error' : ''}`} style={{paddingLeft: '1rem'}}/>
                            {errors.apellido && <p className="field-error-message">{errors.apellido}</p>}
                        </div>
                        <div className="auth-input-group">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} className={`auth-input ${errors.email ? 'input-error' : ''}`}/>
                            {errors.email && <p className="field-error-message">{errors.email}</p>}
                        </div>
                        <div className="auth-input-group">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Crear contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                            />
                            <button type="button" className="password-toggle-button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? 
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : 
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                }
                            </button>
                            {errors.password && <p className="field-error-message">{errors.password}</p>}
                        </div>
                        <div className="auth-input-group">
                            <svg className="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
                            />
                            <button type="button" className="password-toggle-button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? 
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : 
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                            }
                        </button>
                        {errors.confirmPassword && <p className="field-error-message">{errors.confirmPassword}</p>}
                    </div>
                    {errors.api && <p className="error-message">{errors.api}</p>}
                    <button type="submit" className="auth-submit-button">
                        Registrarse
                    </button>
                </form>
            </div>
        </AuthLayout>

        <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
            <h2 style={{ color: 'white', marginTop: 0 }}>¡Registro Exitoso!</h2>
            <p style={{ color: '#d1d5db' }}>Tu cuenta ha sido creada. Ya podés iniciar sesión para comprar tus entradas.</p>
            <button 
                className="auth-submit-button" 
                style={{ marginTop: '1rem' }}
                onClick={() => navigate('/login')}
            >
                Ir a Iniciar Sesión
            </button>
        </Modal>
    </>
    );
};

export default Register;