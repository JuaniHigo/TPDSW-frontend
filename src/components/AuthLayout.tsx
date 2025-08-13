import React from 'react';
import './AuthLayout.css';

interface AuthLayoutProps {
    title: React.ReactNode;
    imageUrl: string; // La URL de la imagen que vamos a recibir
    children: React.ReactNode;
}

// 1. Añadimos 'imageUrl' a la lista de props que recibimos
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, imageUrl, children }) => {
    return (
        <div className="auth-container">
            <div 
                className="auth-left-panel"
                // 2. Usamos la prop 'imageUrl' en lugar de 'authBackground'
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                <div className="auth-overlay">
                    <div className="auth-title">
                        {title}
                    </div>
                </div>
            </div>
            <div className="auth-right-panel">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;