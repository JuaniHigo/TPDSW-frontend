import { useState } from "react";


export default function Clubes() {
  const [clubes, setClubes] = useState([
    { id: 1, nombre: "River Plate"},
    { id: 2, nombre: "Boca Juniors"},
  ]);
  const [nuevoClub, setNuevoClub] = useState({ nombre: ""});

  const handleAdd = () => {
    if (!nuevoClub.nombre) return;
    setClubes([...clubes, { ...nuevoClub, id: Date.now() }]);
    setNuevoClub({ nombre:""});
  };

  const handleDelete = (id:number) => setClubes(clubes.filter(c => c.id !== id));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Clubes</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Nombre del club"
          value={nuevoClub.nombre}
          onChange={e => setNuevoClub({ ...nuevoClub, nombre: e.target.value })}
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
            <th className="p-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clubes.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="p-3">{c.nombre}</td>

              <td className="p-3">
                <button
                  onClick={() => handleDelete(c.id)}
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
