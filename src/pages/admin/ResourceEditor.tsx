import { useCallback, useEffect, useState } from 'react';
import api, { errorMessage, getAll } from '../../services/api';
import type { Club, Estadio } from '../../types/api';
import './Admin.css';
type Row = Record<string, string | number | boolean | null>;
type Kind = 'clubes' | 'estadios' | 'sectores' | 'eventos';
interface Field {
  key: string;
  label: string;
  type?: 'number' | 'date' | 'boolean' | 'state' | 'club' | 'stadium';
  required?: boolean;
}
const fields: Record<Kind, Field[]> = {
  clubes: [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'logoUrl', label: 'URL del logo' },
  ],
  estadios: [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'calle', label: 'Calle' },
    { key: 'numero', label: 'Número' },
    { key: 'ciudad', label: 'Ciudad' },
  ],
  sectores: [
    { key: 'nombreSector', label: 'Nombre del sector', required: true },
    { key: 'capacidad', label: 'Capacidad', type: 'number', required: true },
  ],
  eventos: [
    { key: 'fkIdClubLocal', label: 'Club local', type: 'club', required: true },
    {
      key: 'fkIdClubVisitante',
      label: 'Club visitante',
      type: 'club',
      required: true,
    },
    { key: 'fkIdEstadio', label: 'Estadio', type: 'stadium', required: true },
    { key: 'fechaHora', label: 'Fecha y hora', type: 'date', required: true },
    { key: 'torneo', label: 'Torneo' },
    { key: 'estado', label: 'Estado', type: 'state', required: true },
    { key: 'soloPublicoLocal', label: 'Solo público local', type: 'boolean' },
  ],
};
const ids: Record<Kind, string> = {
  clubes: 'idClub',
  estadios: 'idEstadio',
  sectores: 'idSector',
  eventos: 'idEvento',
};
const titles: Record<Kind, string> = {
  clubes: 'Clubes',
  estadios: 'Estadios',
  sectores: 'Sectores',
  eventos: 'Eventos',
};
function localDate(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}
export default function ResourceEditor({
  kind,
  stadiumId,
  onChanged,
}: {
  kind: Kind;
  stadiumId?: number;
  onChanged?: () => void;
}) {
  const [rows, setRows] = useState<Row[]>([]),
    [form, setForm] = useState<Record<string, string>>({}),
    [editing, setEditing] = useState<number | null>(null);
  const [clubs, setClubs] = useState<Club[]>([]),
    [stadiums, setStadiums] = useState<Estadio[]>([]);
  const [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [busy, setBusy] = useState(false),
    [page, setPage] = useState(1);
  const path =
    '/' + kind + (kind === 'sectores' ? '?fkIdEstadio=' + stadiumId : '');
  const load = useCallback(async () => {
    try {
      const [data, c, s] = await Promise.all([
        getAll<Row>(path),
        kind === 'eventos' ? getAll<Club>('/clubes') : Promise.resolve([]),
        kind === 'eventos' ? getAll<Estadio>('/estadios') : Promise.resolve([]),
      ]);
      setRows(data);
      setClubs(c);
      setStadiums(s);
    } catch (e) {
      setError(errorMessage(e));
    }
  }, [path, kind]);
  useEffect(() => {
    void load();
    setForm({});
    setEditing(null);
    setPage(1);
  }, [load]);
  function edit(row: Row) {
    setEditing(Number(row[ids[kind]]));
    const data: Record<string, string> = {};
    for (const f of fields[kind])
      data[f.key] =
        f.type === 'date'
          ? localDate(String(row[f.key]))
          : String(row[f.key] ?? '');
    setForm(data);
    setMessage('');
  }
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');
    const body: Record<string, unknown> = {};
    for (const f of fields[kind]) {
      const value = form[f.key] ?? (f.type === 'state' ? 'Programado' : '');
      if (f.type === 'boolean') body[f.key] = value === 'true';
      else if (['number', 'club', 'stadium'].includes(f.type ?? ''))
        body[f.key] = Number(value);
      else if (f.type === 'date') body[f.key] = new Date(value).toISOString();
      else body[f.key] = value;
    }
    if (kind === 'sectores' && !editing) body.fkIdEstadio = stadiumId;
    try {
      if (editing) await api.put('/' + kind + '/' + editing, body);
      else await api.post('/' + kind, body);
      setForm({});
      setEditing(null);
      setMessage('Cambios guardados');
      await load();
      onChanged?.();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  async function remove(row: Row) {
    if (!window.confirm('¿Eliminar este registro?')) return;
    setBusy(true);
    setError('');
    try {
      await api.delete('/' + kind + '/' + row[ids[kind]]);
      await load();
      onChanged?.();
      setMessage('Registro eliminado');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h2>{titles[kind]}</h2>
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <form onSubmit={(e) => void save(e)}>
        <h2>
          {editing ? 'Editar' : 'Agregar'}{' '}
          {kind === 'eventos' ? 'evento' : 'registro'}
        </h2>
        {fields[kind].map((f) => (
          <label key={f.key}>
            {f.label}
            {f.type === 'club' || f.type === 'stadium' ? (
              <select
                aria-label={f.label}
                required
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              >
                <option value="">Seleccionar</option>
                {(f.type === 'club'
                  ? clubs.map((c) => ({ id: c.idClub, name: c.nombre }))
                  : stadiums.map((s) => ({ id: s.idEstadio, name: s.nombre }))
                ).map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            ) : f.type === 'state' ? (
              <select
                aria-label={f.label}
                value={form[f.key] ?? 'Programado'}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              >
                {['Programado', 'En Venta', 'Finalizado', 'Cancelado'].map(
                  (s) => (
                    <option key={s}>{s}</option>
                  ),
                )}
              </select>
            ) : f.type === 'boolean' ? (
              <input
                aria-label={f.label}
                type="checkbox"
                checked={form[f.key] === 'true'}
                onChange={(e) =>
                  setForm({ ...form, [f.key]: String(e.target.checked) })
                }
              />
            ) : (
              <input
                aria-label={f.label}
                type={
                  f.type === 'date'
                    ? 'datetime-local'
                    : f.type === 'number'
                      ? 'number'
                      : f.key === 'logoUrl'
                        ? 'url'
                        : 'text'
                }
                required={f.required}
                min={f.type === 'number' ? 1 : undefined}
                value={form[f.key] ?? ''}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              />
            )}
          </label>
        ))}
        <button disabled={busy}>
          {editing ? 'Guardar cambios' : 'Agregar'}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({});
            }}
          >
            Cancelar edición
          </button>
        )}
      </form>
      <div className="admin-table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              {kind === 'eventos' && (
                <>
                  <th>Fecha</th>
                  <th>Estado</th>
                </>
              )}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice((page - 1) * 10, page * 10).map((r) => (
              <tr key={String(r[ids[kind]])}>
                <td>{r[ids[kind]]}</td>
                <td>
                  {kind === 'eventos'
                    ? r.nombreLocal + ' vs ' + r.nombreVisitante
                    : (r.nombre ?? r.nombreSector)}
                </td>
                {kind === 'eventos' && (
                  <>
                    <td>
                      {new Date(String(r.fechaHora)).toLocaleString('es-AR', {
                        timeZone: 'America/Argentina/Buenos_Aires',
                        hour12: false,
                      })}
                    </td>
                    <td>{r.estado}</td>
                  </>
                )}
                <td>
                  <button disabled={busy} onClick={() => edit(r)}>
                    Editar
                  </button>
                  <button disabled={busy} onClick={() => void remove(r)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
        Anterior
      </button>
      <span> Página {page} </span>
      <button
        disabled={page * 10 >= rows.length}
        onClick={() => setPage((p) => p + 1)}
      >
        Siguiente
      </button>
    </section>
  );
}
