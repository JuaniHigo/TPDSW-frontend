import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      
      if (!storedToken) {
        navigate("/login");
        return;
      }

      if (storedUser && storedUser !== 'null') {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parseando usuario:', error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
      } else {
        navigate("/login");
        return;
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#10b981', fontSize: '1.25rem' }}>Cargando...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#111827',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#1f2937',
        padding: '24px 0',
        borderRight: '1px solid #374151',
        
      }}>
        {/* User Profile */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '32px',
          padding: '16px',
          backgroundColor: '#374151',
          borderRadius: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#10b981',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            marginRight: '12px'
          }}>
            {user.nombre?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>
              {user.nombre || 'Usuario'}
            </div>
            <div style={{ fontSize: '14px', color: '#10b981' }}>
              Activo Filial I
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Inicio - Active */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#10b981',
            borderRadius: '8px',
            cursor: 'pointer'
          }}>
            <span style={{ marginRight: '12px' }}>🏠</span>
            <span>Inicio</span>
          </div>

          {/* Mi cuenta */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px' }}>👤</span>
              <span>Mi cuenta</span>
            </div>
            <span>›</span>
          </div>

          {/* Trámites personales */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px' }}>📋</span>
              <span>Trámites personales</span>
            </div>
            <span>›</span>
          </div>

          {/* Tickets */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px' }}>🎫</span>
              <span>Tickets</span>
            </div>
            <span>›</span>
          </div>

          {/* Abonos */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '12px' }}>💳</span>
              <span>Abonos</span>
            </div>
            <span>›</span>
          </div>

          {/* Cambiar usuario */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <span style={{ marginRight: '12px' }}>👥</span>
            <span>Cambiar usuario</span>
          </div>

          {/* Contacto */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#d1d5db',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#374151';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d1d5db';
          }}>
            <span style={{ marginRight: '12px' }}>✉️</span>
            <span>Contacto</span>
          </div>

          {/* Cerrar sesión */}
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#d1d5db',
              backgroundColor: 'transparent',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#d1d5db';
            }}
          >
            <span style={{ marginRight: '12px' }}>🚪</span>
            <span>Cerrar sesión</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px', backgroundColor: '#111827' }}>
        {/* Hero Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
          borderRadius: '16px',
          padding: '48px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ 
              fontSize: '3rem', 
              fontWeight: 'bold', 
              lineHeight: '1.1',
              marginBottom: '16px'
            }}>
              DEJANDO LA VIDA POR<br />
              <span style={{ color: '#a7f3d0' }}>ESTOS COLORES</span>
            </h1>
            <p style={{ fontSize: '1.5rem', color: '#d1fae5', marginTop: '24px' }}>
              Bienvenido de vuelta, {user.nombre}
            </p>
          </div>
          {/* Background decoration */}
          <div style={{
            position: 'absolute',
            right: '48px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '8rem',
            opacity: '0.1'
          }}>
            ⚽
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Mi Entrada */}
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #374151'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>
                MI ENTRADA
              </h2>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#10b981',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎫
              </div>
            </div>
            <p style={{ color: '#9ca3af', marginBottom: '16px' }}>
              Domingo, 17 Agosto 2025
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#374151',
              padding: '16px',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#fbbf24',
                  borderRadius: '4px'
                }}></div>
                <span style={{ fontSize: '12px' }}>DEFENSA Y<br/>JUSTICIA</span>
              </div>
              <span style={{ color: '#9ca3af', fontWeight: 'bold' , margin: '0 10px'}}>vs</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
                <span style={{ fontSize: '12px', textAlign: 'right' }}>NEWELL'S</span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#dc2626',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </div>

          {/* Próximos Partidos */}
          <div style={{
            backgroundColor: '#1f2937',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid #374151'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#10b981' }}>
                PLANTEL DE PRIMERA
              </h2>
              <span style={{ 
                color: '#ef4444', 
                fontSize: '14px', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}>
                Calendario de partidos
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}>
              {/* Partido 1 */}
              <div style={{
                backgroundColor: '#374151',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  LIVE
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  marginBottom: '12px'
                }}>
                  Domingo, 17 Agosto<br />
                  14:00 hs
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                  
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#fbbf24',
                      borderRadius: '2px'
                    }}></div>
                    <span>Defensa y Justicia</span>
                  </div>
                  <span style={{ color: '#9ca3af' , margin: '0 10px'}}>vs.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Newell's</span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#dc2626',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Partido 2 */}
              <div style={{
                backgroundColor: '#374151',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  LIVE
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  marginBottom: '12px'
                  
                }}>
                  Domingo, 24 Agosto<br />
                  14:00 hs
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '2px'
                    }}></div>
                    <span>Rosario Central</span>
                  </div>
                  <span style={{ color: '#9ca3af', margin: '0 10px' }}>vs.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Newell's</span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#dc2626',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Partido 3 */}
              <div style={{
                backgroundColor: '#374151',
                padding: '16px',
                borderRadius: '12px'
              }}>
                <div style={{
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginBottom: '8px'
                }}>
                  LIVE
                </div>
                <div style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  marginBottom: '12px'
                }}>
                  Domingo, 05 Octubre<br />
                  14:00 hs
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#1e40af',
                      borderRadius: '2px'
                    }}></div>
                    <span>Boca Jrs</span>
                  </div>
                  <span style={{ color: '#9ca3af', margin: '0 10px' }}>vs.</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Newell's</span>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#dc2626',
                      borderRadius: '2px'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          <div style={{
            backgroundColor: '#1f2937',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Entradas compradas
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  12
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                🎫
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Partidos asistidos
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  8
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⚽
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#1f2937',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #374151'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '8px' }}>
                  Puntos acumulados
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                  245
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                ⭐
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


