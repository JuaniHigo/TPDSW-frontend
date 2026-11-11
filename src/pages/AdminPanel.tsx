import { Link } from 'react-router-dom';
import './admin/Admin.css';
export default function AdminPanel() {
  return (
    <div className="admin-container">
      <h1>Panel de administración</h1>
      <nav className="admin-nav">
        <Link to="/admin/EditarEvento">Eventos y precios</Link>
        <Link to="/admin/EditarClub">Clubes</Link>
        <Link to="/admin/EditarEstadio">Estadios y sectores</Link>
      </nav>
    </div>
  );
}
