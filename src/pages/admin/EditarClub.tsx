import { useEffect, useState } from "react";
import "./EditarClub.css";

interface Club {
  idClub: number;
  nombre: string;
  logoUrl: string | null;
}

export default function EditarClub() {
  const [clubes, setClubes] = useState<Club[]>([]);
  const [nuevoClub, setNuevoClub] = useState({ nombre: "", logoUrl: "" });
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Obtener clubes del backend
  const fetchClubes = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/clubes");
      const data = await res.json();
      setClubes(
        data.data.sort((a: Club, b: Club) => a.idClub - b.idClub)
      );
    } catch (err) {
      console.error("Error al cargar clubes:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Agregar nuevo club
  const agregarClub = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3000/api/clubes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoClub),
      });

      if (!res.ok) throw new Error("Error al agregar club");

      const data = await res.json();
      setClubes((prev) =>
        [...prev, data].sort((a, b) => a.idClub - b.idClub)
      );
      setNuevoClub({ nombre: "", logoUrl: "" });
    } catch (error) {
      console.error("Error al agregar club:", error);
    }
  };

  // 🔹 Editar club existente
  const guardarCambios = async (id: number) => {
    const token = localStorage.getItem("token");
    const club = clubes.find((c) => c.idClub === id);
    if (!club) return;

    try {
      const res = await fetch(`http://localhost:3000/api/clubes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: club.nombre,
          logoUrl: club.logoUrl,
        }),
      });

      if (!res.ok) throw new Error("Error al editar club");
      setEditandoId(null);
    } catch (error) {
      console.error("Error al editar club:", error);
    }
  };

  // 🔹 Eliminar club
  const eliminarClub = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!confirm("¿Seguro que querés eliminar este club?")) return;

    try {
      const res = await fetch(`http://localhost:3000/api/clubes/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al eliminar club");

      setClubes((prev) => prev.filter((c) => c.idClub !== id));
    } catch (error) {
      console.error("Error al eliminar club:", error);
    }
  };

  useEffect(() => {
    fetchClubes();
  }, []);

  if (loading) return <p className="loading">Cargando clubes...</p>;

  return (
    <div className="editar-club-container">
      <h1 className="titulo">Gestión de Clubes</h1>

      {/* Formulario para agregar club */}
      <form onSubmit={agregarClub} className="formulario">
        <h2>Agregar nuevo club</h2>
        <div className="form-grid">
          <input
            type="text"
            placeholder="Nombre del club"
            value={nuevoClub.nombre}
            onChange={(e) =>
              setNuevoClub({ ...nuevoClub, nombre: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="URL del logo (opcional)"
            value={nuevoClub.logoUrl}
            onChange={(e) =>
              setNuevoClub({ ...nuevoClub, logoUrl: e.target.value })
            }
          />
        </div>
        <button type="submit" className="btn btn-agregar">
          Agregar Club
        </button>
      </form>

      {/* Tabla de clubes */}
      <div className="tabla-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Logo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clubes.map((club) => (
              <tr key={club.idClub}>
                <td>{club.idClub}</td>
                <td>
                  {editandoId === club.idClub ? (
                    <input
                      value={club.nombre}
                      onChange={(e) =>
                        setClubes((prev) =>
                          prev.map((c) =>
                            c.idClub === club.idClub
                              ? { ...c, nombre: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : (
                    club.nombre
                  )}
                </td>
                <td>
                  {editandoId === club.idClub ? (
                    <input
                      value={club.logoUrl ?? ""}
                      onChange={(e) =>
                        setClubes((prev) =>
                          prev.map((c) =>
                            c.idClub === club.idClub
                              ? { ...c, logoUrl: e.target.value }
                              : c
                          )
                        )
                      }
                    />
                  ) : club.logoUrl ? (
                    <img
                      src={club.logoUrl}
                      alt={club.nombre}
                      className="logo-img"
                    />
                  ) : (
                    "Sin logo"
                  )}
                </td>
                <td className="acciones">
                  {editandoId === club.idClub ? (
                    <>
                      <button
                        className="btn btn-guardar"
                        onClick={() => guardarCambios(club.idClub)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-cancelar"
                        onClick={() => setEditandoId(null)}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-editar"
                        onClick={() => setEditandoId(club.idClub)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-eliminar"
                        onClick={() => eliminarClub(club.idClub)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
