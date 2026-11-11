import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function PrivateRoute({ admin = false }: { admin?: boolean }) {
  const { user, token, loading } = useAuth(),
    location = useLocation();
  if (loading) return <p>Cargando sesión...</p>;
  if (!token || !user)
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  if (admin && user.rol !== 'admin')
    return <p role="alert">No tenés permisos para acceder a esta sección.</p>;
  return <Outlet />;
}
