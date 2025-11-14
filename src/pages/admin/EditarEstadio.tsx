import { useEffect, useState } from "react";
import "../admin/EditarEstadio.css";

interface Estadio {
  idEstadio: number;
  nombre: string;
  calle?: string;
  numero?: string;
  ciudad?: string;
}

interface Sector {
  idSector: number;
  nombreSector: string;
  capacidad?: number;
  fkIdEstadio: number;
}

export default function EditarEstadio() {
  const [estadios, setEstadios] = useState<Estadio[]>([]);
  const [nuevoEstadio, setNuevoEstadio] = useState({
    nombre: "",
    calle: "",
    numero: "",
    ciudad: "",
  });
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [nuevoSector, setNuevoSector] = useState({
    nombreSector: "",
    capacidad: "",
  });
  const [estadioSeleccionado, setEstadioSeleccionado] = useState<Estadio | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // 🔹 Cargar estadios
  const fetchEstadios = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/estadios");
      const data = await res.json();
      console.log("Respuesta del Back:", data);
      setEstadios(data.data);
    } catch (err) {
      console.error("Error al cargar estadios:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Crear estadio
  const agregarEstadio = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/estadios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoEstadio),
      });

      if (!res.ok) throw new Error("Error al crear estadio");

      const data = await res.json();
      setEstadios((prev) => [...prev, data]);
      setNuevoEstadio({ nombre: "", calle: "", numero: "", ciudad: "" });
    } catch (error) {
      console.error("Error al agregar estadio:", error);
    }
  };

  // 🔹 Editar estadio
  const guardarEdicion = async (estadio: Estadio) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:3000/api/estadios/${estadio.idEstadio}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(estadio),
        }
      );

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setEstadios((prev) =>
        prev.map((e) => (e.idEstadio === data.idEstadio ? data : e))
      );
      setEstadioSeleccionado(null);
    } catch (error) {
      console.error("Error al editar estadio:", error);
    }
  };

  // 🔹 Eliminar estadio
  const eliminarEstadio = async (idEstadio: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que querés eliminar este estadio?")) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/estadios/${idEstadio}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Error al eliminar estadio");

      setEstadios((prev) => prev.filter((e) => e.idEstadio !== idEstadio));
    } catch (error) {
      console.error("Error al eliminar estadio:", error);
    }
  };

  // 🔹 Cargar sectores de un estadio
  const fetchSectores = async (idEstadio: number) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/sectores?fkIdEstadio=${idEstadio}`
      );
      const data = await res.json();
      setSectores(data.data);
    } catch (err) {
      console.error("Error al cargar sectores:", err);
    }
  };

  // 🔹 Crear sector
  const agregarSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!estadioSeleccionado) return alert("Seleccioná un estadio primero");

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/sectores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombreSector: nuevoSector.nombreSector,
          capacidad: Number(nuevoSector.capacidad),
          fkIdEstadio: estadioSeleccionado.idEstadio,
        }),
      });

      if (!res.ok) throw new Error(`Error ${res.status}`);

      const data = await res.json();
      setSectores((prev) => [...prev, data]);
      setNuevoSector({ nombreSector: "", capacidad: "" });
    } catch (error) {
      console.error("Error al agregar sector:", error);
    }
  };

  // 🔹 Eliminar sector
  const eliminarSector = async (idSector: number) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que querés eliminar este sector?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/sectores/${idSector}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar sector");

      setSectores((prev) => prev.filter((s) => s.idSector !== idSector));
    } catch (error) {
      console.error("Error al eliminar sector:", error);
    }
  };

  useEffect(() => {
    fetchEstadios();
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando estadios...</p>;

  return (
    <div className="agregar-estadio-container">
      <h1 className="titulo">Editar Estadios</h1>

      {/* Crear estadio */}
      <form onSubmit={agregarEstadio} className="formulario"
      >
        <h3>Agregar nuevo estadio</h3>
        <div className="agregar-form">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoEstadio.nombre}
          onChange={(e) =>
            setNuevoEstadio({ ...nuevoEstadio, nombre: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="text"
          placeholder="Calle"
          value={nuevoEstadio.calle}
          onChange={(e) =>
            setNuevoEstadio({ ...nuevoEstadio, calle: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Número"
          value={nuevoEstadio.numero}
          onChange={(e) =>
            setNuevoEstadio({ ...nuevoEstadio, numero: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        />
        <input
          type="text"
          placeholder="Ciudad"
          value={nuevoEstadio.ciudad}
          onChange={(e) =>
            setNuevoEstadio({ ...nuevoEstadio, ciudad: e.target.value })
          }
          className="border p-2 w-full mb-3 rounded"
        />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agregar Estadio
        </button>

      </form>
      

      {/* Listado de estadios */}
      <div className="Listado-estadios mb-8">
        <h3>Listado de estadios</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Nombre</th>
              <th className="p-4 text-left">Ciudad</th>
              <th className="p-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {estadios.map((e) => (
              <tr key={e.idEstadio} className="border-t">
                <td className="p-4">{e.idEstadio}</td>
                <td className="p-4">{e.nombre}</td>
                <td className="p-4">{e.ciudad}</td>
                <td className="p-4 flex gap-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => {
                      setEstadioSeleccionado(e);
                      fetchSectores(e.idEstadio);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    onClick={() => eliminarEstadio(e.idEstadio)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sección de edición */}
      {estadioSeleccionado && (
        <div className="edicion">
          <h2> Editando: {estadioSeleccionado.nombre} </h2>
          <div className="datos-estadios">
          <input
            type="text"
            value={estadioSeleccionado.nombre}
            onChange={(e) =>
              setEstadioSeleccionado({
                ...estadioSeleccionado,
                nombre: e.target.value,
              })
            }
            className="border p-2 w-full mb-3 rounded"
          />
          <input
            type="text"
            value={estadioSeleccionado.ciudad || ""}
            onChange={(e) =>
              setEstadioSeleccionado({
                ...estadioSeleccionado,
                ciudad: e.target.value,
              })
            }
            className="border p-2 w-full mb-3 rounded"
          />
          </div>


          {/* Agregar Sectores al estadio en edicion */}

          <form onSubmit={agregarSector} className="formulario"
          >
            <h3>Sectores</h3>
            <div className="agregar-form">
            <input
              type="text"
              placeholder="Nombre del sector"
              value={nuevoSector.nombreSector}
              onChange={(e) =>
                setNuevoSector({ ...nuevoSector, nombreSector: e.target.value })
              }
              className="border p-2 rounded w-full md:w-1/2"
              required
            />
            <input
              type="number"
              placeholder="Capacidad"
              value={nuevoSector.capacidad}
              onChange={(e) =>
                setNuevoSector({ ...nuevoSector, capacidad: e.target.value })
              }
              className="border p-2 rounded w-full md:w-1/3"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Agregar Sector
            </button>
            </div>
          </form>

          {/*Listado de sectores*/}
            <h3>Lista de sectores</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">ID</th>
                <th className="p-2 text-left">Nombre</th>
                <th className="p-2 text-left">Capacidad</th>
                <th className="p-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sectores.map((s) => (
                <tr key={s.idSector} className="border-t">
                  <td className="p-2">{s.idSector}</td>
                  <td className="p-2">{s.nombreSector}</td>
                  <td className="p-2">{s.capacidad}</td>
                  <td className="p-2">
                    <button
                      onClick={() => eliminarSector(s.idSector)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => guardarEdicion(estadioSeleccionado)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
    
  );
}
