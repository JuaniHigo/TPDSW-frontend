import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api, { getAll } from '../services/api';
import type { Evento, Oferta } from '../types/api';
import { usePurchase } from '../hooks/usePurchase';
import './ResumenEvento.css';
export default function ResumenEvento() {
  const id = Number(useParams().id),
    { purchase } = usePurchase();
  const [event, setEvent] = useState<Evento | null>(null),
    [offers, setOffers] = useState<Oferta[]>([]),
    [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.all([
      api.get<Evento>('/eventos/' + id),
      getAll<Oferta>('/eventos/' + id + '/sectores'),
    ])
      .then(([e, o]) => {
        if (active) {
          setEvent(e.data);
          setOffers(o);
        }
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [id]);
  const sector = offers.find((s) => s.idSector === purchase.sectorId);
  if (error) return <p>No se pudo cargar el resumen.</p>;
  if (!event) return <p>Cargando resumen...</p>;
  return (
    <div className="resumen-evento-wrapper">
      <h2>
        {event.nombreLocal} vs {event.nombreVisitante}
      </h2>
      <p>
        {new Date(event.fechaHora).toLocaleString('es-AR', {
          timeZone: 'America/Argentina/Buenos_Aires',
          hour12: false,
        })}
      </p>
      <p>{event.nombreEstadio}</p>
      {sector && (
        <>
          <p>
            {sector.nombreSector} · {purchase.quantity} entradas
          </p>
          <p>Precio unitario: $ {sector.precio}</p>
          <strong>
            Total: $ {(Number(sector.precio) * purchase.quantity).toFixed(2)}
          </strong>
        </>
      )}
    </div>
  );
}
