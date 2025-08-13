import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './ProfileMenu.css'; // Crearemos este archivo para los estilos

const ProfileMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/');
    };

    // Cierra el menú si el usuario hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-menu-container" ref={menuRef}>
            <button className="profile-button" onClick={() => setIsOpen(!isOpen)}>
                {/* Ícono de Perfil SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <Link to="/mis-entradas" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        Mis Entradas
                    </Link>
                    <Link to="/configuracion" className="dropdown-item" onClick={() => setIsOpen(false)}>
                        Configuración
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item logout">
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileMenu;