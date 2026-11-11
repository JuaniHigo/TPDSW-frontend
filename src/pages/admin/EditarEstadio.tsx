import { useCallback, useEffect, useState } from 'react';
import ResourceEditor from './ResourceEditor';
import { getAll, errorMessage } from '../../services/api';
import type { Estadio } from '../../types/api';
export default function EditarEstadio() {
  const [rows, setRows] = useState<Estadio[]>([]),
    [id, setId] = useState(0),
    [error, setError] = useState('');
  const load = useCallback(() => {
    getAll<Estadio>('/estadios')
      .then(setRows)
      .catch((e) => setError(errorMessage(e)));
  }, []);
  useEffect(load, [load]);
  return (
    <div className="admin-container">
      <h1>Estadios y sectores</h1>
      <ResourceEditor kind="estadios" onChanged={load} />
      <h2>Sectores por estadio</h2>
      {error && <p role="alert">{error}</p>}
      <label>
        Estadio
        <select value={id} onChange={(e) => setId(Number(e.target.value))}>
          <option value={0}>Seleccionar estadio</option>
          {rows.map((s) => (
            <option key={s.idEstadio} value={s.idEstadio}>
              {s.nombre}
            </option>
          ))}
        </select>
      </label>
      {id > 0 && <ResourceEditor key={id} kind="sectores" stadiumId={id} />}
    </div>
  );
}
