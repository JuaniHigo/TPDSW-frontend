import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import EventCard from './EventCard'; // Reutilizamos la tarjeta de evento
import './ResumenEvento.css';

// --- INTERFAZ CORREGIDA ---
interface EventoCompleto {
    id_evento: number;
    nombre_local: string;
    nombre_visitante: string;
    fecha_hora: string;
    torneo: string;
    logo_local?: string;      // <-- AÑADIDO
    logo_visitante?: string;  // <-- AÑADIDO
}
// --------------------------

const ResumenEvento = () => {
    const { id: eventoId } = useParams<{ id: string }>();
    const [evento, setEvento] = useState<EventoCompleto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (eventoId) {
            api.get(`/eventos/${eventoId}`)
                .then(response => {
                    setEvento(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error al obtener el resumen del evento:", error);
                    setLoading(false);
                });
        }
    }, [eventoId]);

    if (loading) return <div className="resumen-evento-wrapper loading">Cargando resumen...</div>;
    if (!evento) return <div className="resumen-evento-wrapper error">No se pudo cargar el resumen.</div>;

    return (
        <div className="resumen-evento-wrapper">
            <EventCard evento={evento} />
        </div>
    );
};

export default ResumenEvento;