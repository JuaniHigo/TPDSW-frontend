import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage, getAll } from '../services/api';
import type { Evento, Oferta, Estadio } from '../types/api';
import backgroundImage from '../assets/hinchada.jpg';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../hooks/usePurchase';
import './EventoDetalle.css';
export default function EventoDetalle() {
  const id = Number(useParams().id),
    navigate = useNavigate(),
    { token } = useAuth(),
    { purchase, setPurchase } = usePurchase();
  const [evento, setEvento] = useState<Evento | null>(null),
    [oferta, setOferta] = useState<Oferta[]>([]);
  const [stadium, setStadium] = useState<Estadio | null>(null);
  const [sectorId, setSectorId] = useState(
      purchase.eventoId === id ? purchase.sectorId : null,
    ),
    [quantity, setQuantity] = useState(
      purchase.eventoId === id ? purchase.quantity : 1,
    );
  const [error, setError] = useState(''),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setSectorId(purchase.eventoId === id ? purchase.sectorId : null);
    setQuantity(purchase.eventoId === id ? purchase.quantity : 1);
    Promise.all([
      api.get<Evento>('/eventos/' + id),
      getAll<Oferta>('/eventos/' + id + '/sectores'),
    ])
      .then(([e, o]) => {
        if (active) {
          setEvento(e.data);
          setOferta(o);
        }
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, purchase.eventoId, purchase.sectorId, purchase.quantity]);
  const stadiumId = evento?.fkIdEstadio;
  useEffect(() => {
    let active = true;
    setStadium(null);
    if (stadiumId)
      api
        .get<Estadio>('/estadios/' + stadiumId)
        .then((r) => {
          if (active) setStadium(r.data);
        })
        .catch(() => {});
    return () => {
      active = false;
    };
  }, [stadiumId]);
  const selected = oferta.find((s) => s.idSector === sectorId);
  const available =
    evento?.estado === 'En Venta' &&
    new Date(evento.fechaHora).getTime() > Date.now();
  const valid =
    selected &&
    quantity > 0 &&
    quantity <= Math.min(100, selected.disponibles) &&
    available;
  function buy() {
    if (!valid) return;
    setPurchase({
      eventoId: id,
      sectorId: selected.idSector,
      quantity,
      idempotencyKey: crypto.randomUUID(),
    });
    const destination = '/evento/' + id + '/comprar';
    if (token) navigate(destination);
    else navigate('/login', { state: { from: destination } });
  }
  if (loading) return <p>Cargando evento...</p>;
  if (!evento) return <p role="alert">{error || 'Evento no encontrado'}</p>;
  return (
    <div className="evento-detalle-container">
      <header
        className="detalle-header"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="detalle-header-overlay">
          <h1>
            {evento.nombreLocal} vs {evento.nombreVisitante}
          </h1>
          <p>{evento.torneo}</p>
          <p>
            {new Date(evento.fechaHora).toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
              hour12: false,
            })}{' '}
            · {evento.nombreEstadio}
          </p>
        </div>
      </header>
      <div className="detalle-info-body">
        {stadium?.calle && (
          <p>
            Dirección: {stadium.calle} {stadium.numero}, {stadium.ciudad}
          </p>
        )}
        <h2>Elegí tus entradas</h2>
        {!available && <p>Este evento no está disponible para la venta.</p>}
        <label>
          Sector
          <select
            aria-label="Sector"
            value={sectorId ?? ''}
            onChange={(e) => setSectorId(Number(e.target.value) || null)}
          >
            <option value="">Seleccioná un sector</option>
            {oferta.map((s) => (
              <option
                key={s.idSector}
                value={s.idSector}
                disabled={!s.disponibles}
              >
                {s.nombreSector} · $ {s.precio} · {s.disponibles} disponibles
              </option>
            ))}
          </select>
        </label>
        <label>
          Cantidad
          <input
            aria-label="Cantidad"
            type="number"
            min="1"
            max={Math.min(100, selected?.disponibles ?? 1)}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>
        {selected && (
          <p>Total: $ {(Number(selected.precio) * quantity).toFixed(2)}</p>
        )}
        {error && <p role="alert">{error}</p>}
        <button onClick={buy} disabled={!valid}>
          Continuar con la compra
        </button>
        {stadium?.calle && (
          <iframe
            title="Ubicación del estadio"
            src={
              'https://maps.google.com/maps?q=' +
              encodeURIComponent(
                [stadium.calle, stadium.numero, stadium.ciudad]
                  .filter(Boolean)
                  .join(' '),
              ) +
              '&output=embed'
            }
            width="100%"
            height="280"
            loading="lazy"
            style={{ border: 0, marginTop: '2rem' }}
          />
        )}
      </div>
    </div>
  );
}
