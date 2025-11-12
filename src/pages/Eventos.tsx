import { useState } from "react";

export default function Eventos() {
  const [eventos, setEventos] = useState([
    { id: 1, nombre: "River vs Boca", fecha: "2025-11-20" },
    { id: 2, nombre: "Independiente vs Racing", fecha: "2025-12-02" },
  ]);
  const [nuevoEvento, setNuevoEvento] = useState({ nombre: "", fecha: "" });

  const handleAdd = () => {
    if (!nuevoEvento.nombre || !nuevoEvento.fecha) return;
    setEventos([...eventos, { ...nuevoEvento, id: Date.now() }]);
    setNuevoEvento({ nombre: "", fecha: "" });
  };

  const handleDelete = (id:number) => setEventos(eventos.filter(e => e.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Eventos</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Nombre del evento"
          value={nuevoEvento.nombre}
          onChange={e => setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <input
          type="date"
          value={nuevoEvento.fecha}
          onChange={e => setNuevoEvento({ ...nuevoEvento, fecha: e.target.value })}
          className="border p-2 rounded w-1/3"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar
        </button>
      </div>

      <table className="w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="p-3">Nombre</th>
            <th className="p-3">Fecha</th>
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="p-3">{e.nombre}</td>
              <td className="p-3">{e.fecha}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(e.id)}
                  className="text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
