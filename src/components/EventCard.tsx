import { Link } from 'react-router-dom';
import './EventCard.css';

import type { Evento } from '../types/api';

interface EventCardProps {
  evento: Evento;
}

const EventCard = ({ evento }: EventCardProps) => {
  const fecha = new Date(evento.fechaHora);
  const dia = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  const hora = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link to={`/evento/${evento.idEvento}`} className="event-card">
      <div className="card-header">
        <span className="torneo-tag">{evento.torneo}</span>
        <span className="fecha-hora">
          {dia} - {hora} hs
        </span>
      </div>
      <div className="card-body">
        <div className="team">
          <img
            src={evento.logoLocal || 'https://placehold.co/100x100?text=?'}
            alt={evento.nombreLocal}
            className="team-logo"
          />
          <span className="team-name">{evento.nombreLocal}</span>
        </div>
        <span className="vs-text">VS.</span>
        <div className="team">
          <img
            src={evento.logoVisitante || 'https://placehold.co/100x100?text=?'}
            alt={evento.nombreVisitante}
            className="team-logo"
          />
          <span className="team-name">{evento.nombreVisitante}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
