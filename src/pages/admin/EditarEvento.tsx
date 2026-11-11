import { useCallback, useEffect, useState } from 'react';
import ResourceEditor from './ResourceEditor';
import api, { getAll, errorMessage } from '../../services/api';
import type { Evento, Sector } from '../../types/api';
interface Precio {
  fkIdEvento: number;
  fkIdSector: number;
  precio: string;
}
export default function EditarEvento() {
  const [events, setEvents] = useState<Evento[]>([]),
    [eventId, setEventId] = useState(0),
    [sectors, setSectors] = useState<Sector[]>([]),
    [sectorId, setSectorId] = useState(0),
    [prices, setPrices] = useState<Precio[]>([]),
    [precio, setPrecio] = useState(''),
    [error, setError] = useState(''),
    [busy, setBusy] = useState(false);
  const loadEvents = useCallback(() => {
    getAll<Evento>('/eventos')
      .then(setEvents)
      .catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(loadEvents, [loadEvents]);
  const stadiumId = events.find((e) => e.idEvento === eventId)?.fkIdEstadio;
  const loadPrices = useCallback(async () => {
    if (!eventId) return;
    try {
      setPrices(await getAll<Precio>('/precios/evento/' + eventId));
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [eventId]);
  useEffect(() => {
    setSectorId(0);
    setPrecio('');
    if (stadiumId) {
      getAll<Sector>('/sectores?fkIdEstadio=' + stadiumId)
        .then(setSectors)
        .catch((e) => setError(errorMessage(e)));
      void loadPrices();
    } else {
      setSectors([]);
      setPrices([]);
    }
  }, [stadiumId, loadPrices]);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/precios', {
        fkIdEvento: eventId,
        fkIdSector: sectorId,
        precio,
      });
      await loadPrices();
      setPrecio('');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove(sid: number) {
    if (!window.confirm('¿Eliminar este precio?')) return;
    setBusy(true);
    try {
      await api.delete('/precios/' + eventId + '/' + sid);
      await loadPrices();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-container">
      <h1>Eventos y precios</h1>
      <ResourceEditor kind="eventos" onChanged={loadEvents} />
      <h2>Precios por sector</h2>
      <p>
        Creá el evento como Programado, asigná precios y luego cambialo a En
        Venta.
      </p>
      {error && <p role="alert">{error}</p>}
      <label>
        Evento
        <select
          value={eventId}
          onChange={(e) => setEventId(Number(e.target.value))}
        >
          <option value={0}>Seleccionar evento</option>
          {events.map((e) => (
            <option key={e.idEvento} value={e.idEvento}>
              {e.nombreLocal} vs {e.nombreVisitante} · #{e.idEvento}
            </option>
          ))}
        </select>
      </label>
      {eventId > 0 && (
        <>
          <form onSubmit={(e) => void save(e)}>
            <label>
              Sector
              <select
                required
                value={sectorId || ''}
                onChange={(e) => setSectorId(Number(e.target.value))}
              >
                <option value="">Seleccionar sector</option>
                {sectors.map((s) => (
                  <option key={s.idSector} value={s.idSector}>
                    {s.nombreSector}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Precio en ARS
              <input
                required
                type="number"
                min=".01"
                step=".01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
              />
            </label>
            <button disabled={busy}>Guardar precio</button>
          </form>
          <table>
            <thead>
              <tr>
                <th>Sector</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((p) => (
                <tr key={p.fkIdSector}>
                  <td>
                    {
                      sectors.find((s) => s.idSector === p.fkIdSector)
                        ?.nombreSector
                    }
                  </td>
                  <td>$ {p.precio}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSectorId(p.fkIdSector);
                        setPrecio(p.precio);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => void remove(p.fkIdSector)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
