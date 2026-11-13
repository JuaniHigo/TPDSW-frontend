import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../pages/admin/Admin.css';
export default function PrivateRoute({ admin = false }: { admin?: boolean }) {
  const { user, token, loading } = useAuth(),
    location = useLocation();
  if (loading)
    return (
      <div className="admin-container">
        <p role="status">Cargando sesión...</p>
      </div>
    );
  if (!token || !user)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  if (admin && user.rol !== 'admin')
    return (
      <div className="admin-container">
        <p role="alert">No tenés permisos para acceder a esta sección.</p>
      </div>
    );
  return <Outlet />;
}
