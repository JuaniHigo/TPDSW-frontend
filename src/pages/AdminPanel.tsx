import { Link } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      padding: '32px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>

      {/* Banner Superior estilo Dashboard */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '8px',
            lineHeight: '1.2',
            marginTop: 0
          }}>
            PANEL DE <br />
            <span style={{ color: '#a7f3d0' }}>ADMINISTRACIÓN</span>
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#d1fae5', margin: 0 }}>
            Gestioná los datos principales de la plataforma
          </p>
        </div>
        {/* Decoración de fondo */}
        <div style={{
          position: 'absolute',
          right: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '7rem',
          opacity: '0.1'
        }}>
          ⚙️
        </div>
      </div>

      {/* Grilla de Tarjetas de Navegación */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>

        {/* Tarjeta Eventos */}
        <Link
          to="/admin/EditarEvento"
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '32px',
            borderRadius: '16px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1f2937';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px'
          }}>
            📅
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981', margin: '0 0 8px 0' }}>Eventos</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Administrar partidos, fechas y horarios</p>
        </Link>

        {/* Tarjeta Clubes */}
        <Link
          to="/admin/EditarClub"
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '32px',
            borderRadius: '16px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1f2937';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px'
          }}>
            🛡️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981', margin: '0 0 8px 0' }}>Clubes</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Gestionar equipos, planteles y escudos</p>
        </Link>

        {/* Tarjeta Estadios */}
        <Link
          to="/admin/EditarEstadio"
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            padding: '32px',
            borderRadius: '16px',
            textDecoration: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.transform = 'translateY(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1f2937';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            marginBottom: '16px'
          }}>
            🏟️
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981', margin: '0 0 8px 0' }}>Estadios</h2>
          <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Configurar sedes, sectores y capacidades</p>
        </Link>

      </div>
    </div>
  );
};

export default AdminPanel;