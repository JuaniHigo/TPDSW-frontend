import { Link } from 'react-router-dom';
import './EventCard.css';

interface Evento {
    id_evento: number;
    nombre_local: string;
    nombre_visitante: string;
    fecha_hora: string;
    torneo: string;
    logo_local?: string;
    logo_visitante?: string;
}

interface EventCardProps {
    evento: Evento;
}

const EventCard = ({ evento }: EventCardProps) => {
    const fecha = new Date(evento.fecha_hora);
    const dia = fecha.toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'long' });
    const hora = fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

    return (
        <Link to={`/evento/${evento.id_evento}`} className="event-card">
            <div className="card-header">
                <span className="torneo-tag">{evento.torneo}</span>
                <span className="fecha-hora">{dia} - {hora} hs</span>
            </div>
            <div className="card-body">
                <div className="team">
                    <img src={evento.logo_local || 'https://placehold.co/100x100?text=?'} alt={evento.nombre_local} className="team-logo" />
                    <span className="team-name">{evento.nombre_local}</span>
                </div>
                <span className="vs-text">VS.</span>
                <div className="team">
                    <img src={evento.logo_visitante || 'https://placehold.co/100x100?text=?'} alt={evento.nombre_visitante} className="team-logo" />
                    <span className="team-name">{evento.nombre_visitante}</span>
                </div>
            </div>
        </Link>
    );
};

export default EventCard;
