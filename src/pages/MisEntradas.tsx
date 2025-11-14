import { useState, useEffect } from "react";
import {
  getMisEntradas,
  type EntradaComprada,
} from "../services/entradasService";
import EntradaCard from "../components/EntradaCard";
import "./MisEntradas.css";

const MisEntradas = () => {
  const [entradas, setEntradas] = useState<EntradaComprada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntradas = async () => {
      try {
        const data = await getMisEntradas();
        setEntradas(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          "No se pudieron cargar tus entradas. Es posible que necesites iniciar sesión."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEntradas();
  }, []);

  return (
    <div className="mis-entradas-container">
      <h1>Mis Entradas</h1>

      {loading && (
        <p className="loading-msg">Cargando tu historial de entradas...</p>
      )}

      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && entradas.length === 0 && (
        <p className="info-msg">Aún no has comprado ninguna entrada.</p>
      )}

      {!loading && !error && entradas.length > 0 && (
        <div className="entradas-grid-historial">
          {entradas.map((entrada) => (
            <EntradaCard key={entrada.idEntrada} entrada={entrada} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisEntradas;
