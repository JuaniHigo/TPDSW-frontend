import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './EventoDetalle.css'; // Crearemos este archivo para los estilos
import { useAuth } from '../hooks/useAuth';

interface EventoDetalleData {
    id_evento: number;
    nombre_local: string;
    nombre_visitante: string;
    nombre_estadio: string;
    fecha_hora: string;
    torneo: string;
    imagen_url?: string;
}

const EventoDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<EventoDetalleData | null>(null);
    const [loading, setLoading] = useState(true);
    
    const { token } = useAuth(); // 3. Obtenemos el token del usuario
    const navigate = useNavigate(); // 4. Obtenemos la función para navegar

    useEffect(() => {
        if (id) {
            api.get(`/eventos/${id}`)
                .then(response => {
                    setEvento(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener el detalle del evento:", error);
                    setLoading(false);
                });
        }
    }, [id]);

    // 5. Creamos la función que manejará el clic en el botón
    const handleCompraClick = () => {
        if (token) {
            // Si el usuario tiene un token (está logueado), continuamos con la compra
            // Por ahora, solo mostramos una alerta
        } else {
            // Si no hay token, lo redirigimos a la página de login
            navigate('/login');
        }
    };

    if (loading) {
        return <p>Cargando detalle del evento...</p>;
    }

    if (!evento) {
        return <p>Evento no encontrado.</p>;
    }

    const placeholderImage = `https://placehold.co/1200x400/1f2937/ffffff?text=${evento.nombre_local}%20vs%20${evento.nombre_visitante}`;

    return (
        <div className="evento-detalle-container">
            <header className="detalle-header" style={{ backgroundImage: `url(${evento.imagen_url || placeholderImage})` }}>
                <div className="detalle-header-overlay">
                    <h1>{evento.nombre_local} vs {evento.nombre_visitante}</h1>
                </div>
            </header>
            <div className="detalle-info-body">
                <h2>Detalles del Partido</h2>
                <p><strong>Torneo:</strong> {evento.torneo}</p>
                <p><strong>Fecha y Hora:</strong> {new Date(evento.fecha_hora).toLocaleString('es-AR')}</p>
                <p><strong>Estadio:</strong> {evento.nombre_estadio}</p>
                {/* 6. Asignamos la nueva función al evento onClick del botón */}
                <button className="comprar-button" onClick={handleCompraClick}>
                    Comprar Entradas
                </button>
            </div>
        </div>
    );
};

export default EventoDetalle;