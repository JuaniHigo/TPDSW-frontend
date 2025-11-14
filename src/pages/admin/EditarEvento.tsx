import { useState, useEffect } from "react";

interface Evento {
  id: number;
  nombre: string;
  fecha: string;
}

const EditarEvento = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // Traer eventos del backend
  const fetchEventos = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/eventos"); // Cambiar por tu endpoint real
      const data = await res.json();
      setEventos(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  // Eliminar evento
  const eliminarEvento = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/eventos/${id}`, { method: "DELETE" });
      setEventos(eventos.filter(e => e.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-8">Cargando eventos...</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Editar Eventos</h1>
      <button className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
        Agregar Evento
      </button>

      <table className="w-full bg-white shadow rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="text-left p-4">Nombre</th>
            <th className="text-left p-4">Fecha</th>
            <th className="text-left p-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.map((evento) => (
            <tr key={evento.id} className="border-b">
              <td className="p-4">{evento.nombre}</td>
              <td className="p-4">{evento.fecha}</td>
              <td className="p-4">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition">
                  Editar
                </button>
                <button
                  onClick={() => eliminarEvento(evento.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
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
};

export default EditarEvento;
