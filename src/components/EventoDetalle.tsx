import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './EventoDetalle.css';
import { useAuth } from '../hooks/useAuth';

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
    // otros campos que devuelva tu API
}

const EventoDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<EventoDetalleData | null>(null);
    const [estadio, setEstadio] = useState<Estadio | null>(null);
    const [loading, setLoading] = useState(true);

    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            api.get(`/eventos/${id}`)
                .then(response => {
                    setEvento(response.data);

                    if (response.data.fk_id_estadio) {
                        console.log("ID del estadio a pedir:", response.data.fk_id_estadio);
                        return api.get(`/estadios/${response.data.fk_id_estadio}`);
                    }
                })
                .then(response => {
                    if (response) {
                        console.log("Datos del estadio:", response.data);
                        setEstadio(response.data);
                    }
                })
                .catch(error => {
                    console.error("Error al obtener detalle del evento o estadio:", error);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    const handleCompraClick = () => {
        if (token) {
            alert("Redirigir a compra de entradas"); 
        } else {
            navigate('/login');
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
