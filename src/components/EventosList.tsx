import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api';
import type { Evento, Page } from '../types/api';
import EventCard from './EventCard';
import './EventosList.css';
export default function EventosList() {
  const [eventos, setEventos] = useState<Evento[]>([]),
    [page, setPage] = useState(1),
    [pages, setPages] = useState(1),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get<Page<Evento>>('/eventos', { params: { page, limit: 10 } })
      .then((r) => {
        if (active) {
          setEventos(r.data.data);
          setPages(r.data.pagination.totalPages);
          setError('');
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
  }, [page]);
  return (
    <div className="eventos-list-container">
      <h2>Eventos</h2>
      {loading ? (
        <p>Cargando eventos...</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <>
          <div className="eventos-grid">
            {eventos.map((e) => (
              <EventCard key={e.idEvento} evento={e} />
            ))}
          </div>
          {!eventos.length && <p>No hay eventos disponibles.</p>}
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Anterior
          </button>
          <span> Página {page} </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </>
      )}
    </div>
  );
}
