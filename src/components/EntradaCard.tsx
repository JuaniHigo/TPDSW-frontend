import QRCode from "react-qr-code";
import { EntradaComprada } from "../services/entradasService";
import "./EntradaCard.css";

interface Props {
  entrada: EntradaComprada;
}

const EntradaCard = ({ entrada }: Props) => {
  const fechaEvento = new Date(entrada.fechaHora);
  const dia = fechaEvento.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  const hora = fechaEvento.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="entrada-card">
      <div className="entrada-header">
        <div className="team">
          <img
            src={entrada.logoLocal || "https://placehold.co/100x100?text=?"}
            alt={entrada.nombreLocal}
          />
          <span>{entrada.nombreLocal}</span>
        </div>
        <span className="vs">vs</span>
        <div className="team">
          <img
            src={entrada.logoVisitante || "https://placehold.co/100x100?text=?"}
            alt={entrada.nombreVisitante}
          />
          <span>{entrada.nombreVisitante}</span>
        </div>
      </div>

      <div className="entrada-body">
        <div className="entrada-info">
          <p>
            <strong>Torneo:</strong>
            {entrada.torneo}
          </p>
          <p>
            <strong>Fecha:</strong>
            {dia}-{hora} hs
          </p>
          <p>
            <strong>Sector:</strong>
            {entrada.nombreSector}
          </p>
          <p className="entrada-id">Entrada #{entrada.idEntrada}</p>
        </div>
        <div className="entrada-qr">
          <QRCode
            value={entrada.codigoQr}
            size={128}
            bgColor="#FFFFFF"
            fgColor="#111827"
          />
        </div>
      </div>
    </div>
  );
};

export default EntradaCard;
