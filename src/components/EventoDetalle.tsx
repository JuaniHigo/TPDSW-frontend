import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './EventoDetalle.css';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../hooks/usePurchase';

interface EventoDetalleData {
    id_evento: number;
    fk_id_club_local: number;
    fk_id_club_visitante: number;
    fk_id_estadio: number;
    fecha_hora: string;
    torneo: string;
    estado: string;
    solo_publico_local: number;
    imagen_url?: string;
    nombre_local: string;
    nombre_visitante: string;
    nombre_estadio: string;
}

interface Estadio {
    id_estadio: number;
    nombre: string;
    calle: string;
    numero: string;
    capacidad: number;
    ciudad: string;
}

const EventoDetalle = () => {
    const { id: eventoId } = useParams<{ id: string }>(); // Renombrado para mayor claridad
    const [evento, setEvento] = useState<EventoDetalleData | null>(null);
    const [estadio, setEstadio] = useState<Estadio | null>(null);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const navigate = useNavigate();
    const { setPurchase } = usePurchase();

    useEffect(() => {
        if (eventoId) {
            api.get(`/eventos/${eventoId}`)
                .then(response => {
                    setEvento(response.data);
                    if (response.data.fk_id_estadio) {
                        return api.get(`/estadios/${response.data.fk_id_estadio}`);
                    }
                })
                .then(response => {
                    if (response) {
                        setEstadio(response.data);
                    }
                })
                .catch(error => {
                    console.error("Error al obtener detalle del evento o estadio:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [eventoId]);

    const handleCompraClick = () => {
        // Primero, verificamos si el usuario está logueado
        if (!token) {
            navigate('/login');
            return;
        }

        // Si está logueado y tenemos un ID de evento, procedemos
        if (eventoId) {
            // 1. Guardamos datos de prueba en el contexto global de compra
            setPurchase({
                eventoId: eventoId,
                sectorId: '1', // Usamos un ID de sector de prueba
                quantity: 1
            });

            // 2. Navegamos a la página de pago específica de este evento
            navigate(`/evento/${eventoId}/comprar`);
        } else {
            console.error("No se encontró el ID del evento para iniciar la compra.");
            alert("Hubo un error, por favor intenta de nuevo.");
        }
    };
const handleCompraClick = () => {
  if (!evento) return; // evita que se ejecute sin datos

  if (token) {
    navigate(`/comprar/${evento.id_evento}`);
  } else {
    navigate('/login', { state: { from: `/comprar/${evento.id_evento}` } });
  }
};

    if (loading) return <p>Cargando detalle del evento...</p>;
    if (!evento) return <p>Evento no encontrado.</p>;

    const placeholderImage = `https://placehold.co/1200x400/1f2937/ffffff?text=${evento.nombre_local}%20vs%20${evento.nombre_visitante}`;

    return (
        <div className="evento-detalle-container">
            <header
                className="detalle-header"
                style={{ backgroundImage: `url(${evento.imagen_url || placeholderImage})` }}
            >
                <div className="detalle-header-overlay">
                    <h1>{evento.torneo}</h1>
                    <h2>{evento.nombre_local} vs {evento.nombre_visitante}</h2>
                </div>
            </header>

            <div className="detalle-info-body">
                <h2>Detalles del Partido</h2>
                <p><strong>Torneo:</strong> {evento.torneo}</p>
                <p><strong>Fecha y Hora:</strong> {new Date(evento.fecha_hora).toLocaleString('es-AR')}</p>
                <p><strong>Estadio:</strong> {evento.nombre_estadio}</p>

                {estadio && (
                    <div className="detalle-estadio">
                        <p><strong>Dirección:</strong> {estadio.calle} {estadio.numero}, {estadio.ciudad}</p>
                        <div className="mapa-container">
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(estadio.calle + ' ' + estadio.numero + ' ' + estadio.ciudad)}&output=embed`}
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                )}

{estadio && (
  <div className="detalle-estadio">
    <p><strong>Dirección:</strong> {estadio.calle} {estadio.numero}</p>

    {/* Miniatura del mapa */}
    <div className="mapa-container">
      <iframe
        src={`https://www.google.com/maps?q=${encodeURIComponent(estadio.calle + ' ' + estadio.numero + ' ' + estadio.ciudad)}&output=embed`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  </div>
)}
                <p><strong>Información importante sobre cómo ingresar a la cancha:</strong></p>
                <p>Socios: Los socios habilitados por el Club pueden adquirir su entrada con un canje para el sector Popular o comprar con una tarifa diferenciada una platea. Para ingresar a la cancha, deberán presentar el carnet de socio que será escaneado en los accesos.</p>

                <button className="comprar-button" onClick={handleCompraClick}>
                    Comprar Entradas
                </button>
            </div>
        </div>
    );
};

export default EventoDetalle;