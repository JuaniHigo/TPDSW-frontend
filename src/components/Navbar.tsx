import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ProfileMenu from './ProfileMenu'; // 1. Importamos el nuevo componente
import logoImage from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const { token } = useAuth();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <img src={logoImage} alt="Kicket Logo" className="navbar-logo" />
                <h1>Kicket</h1>
            </Link>
            <div className="navbar-auth">
                {/* 2. Lógica condicional actualizada */}
                {token ? (
                    <ProfileMenu />
                ) : (
                    <>
                        <Link to="/login" className="nav-button secondary">
                            Iniciar Sesión
                        </Link>
                        <Link to="/register" className="nav-button primary">
                            Registrarse
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;