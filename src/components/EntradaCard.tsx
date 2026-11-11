import TicketQr from './TicketQr';
import type { EntradaComprada } from '../services/entradasService';
import './EntradaCard.css';
import './DemoNotice.css';

interface Props {
  entrada: EntradaComprada;
}

const EntradaCard = ({ entrada }: Props) => {
  const fechaEvento = new Date(entrada.fechaHora);
  const dia = fechaEvento.toLocaleDateString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
  const hora = fechaEvento.toLocaleTimeString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="entrada-card">
      {entrada.esDemo && (
        <p className="entrada-demo-label">
          Entrada demo · sin validez para ingreso
        </p>
      )}
      <div className="entrada-header">
        <div className="team">
          {entrada.logoLocal ? (
            <img src={entrada.logoLocal} alt={entrada.nombreLocal} />
          ) : (
            <span className="team-placeholder" aria-hidden="true">
              {entrada.nombreLocal.charAt(0)}
            </span>
          )}
          <span>{entrada.nombreLocal}</span>
        </div>
        <span className="vs">vs</span>
        <div className="team">
          {entrada.logoVisitante ? (
            <img src={entrada.logoVisitante} alt={entrada.nombreVisitante} />
          ) : (
            <span className="team-placeholder" aria-hidden="true">
              {entrada.nombreVisitante.charAt(0)}
            </span>
          )}
          <span>{entrada.nombreVisitante}</span>
        </div>
      </div>

      <div className="entrada-body">
        <div className="entrada-info">
          {entrada.torneo && (
            <p>
              <strong>Torneo:</strong> {entrada.torneo}
            </p>
          )}
          <p>
            <strong>Fecha:</strong> {dia} · {hora} hs
          </p>
          <p>
            <strong>Sector:</strong> {entrada.nombreSector}
          </p>
          <p className="entrada-id">Entrada #{entrada.idEntrada}</p>
        </div>
        <div className="entrada-qr">
          <TicketQr value={entrada.codigoQr} />
        </div>
      </div>
    </div>
  );
};

export default EntradaCard;
