import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from './EventCard';
import './EventosList.css';

// Interfaz actualizada para incluir todos los campos necesarios
interface Evento {
    id_evento: number;
    nombre_local: string;
    nombre_visitante: string;
    fecha_hora: string;
    torneo: string;
    logo_local?: string;
    logo_visitante?: string;
}

const EventosList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        api.get('/eventos')
            .then(response => {
                setEventos(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener los eventos:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Cargando eventos...</p>;
    }

    if (eventos.length === 0) {
        return (
            <div className="eventos-list-container">
                <h2>Próximos Eventos</h2>
                <p>No hay eventos disponibles en este momento.</p>
            </div>
        );
    }

    return (
        <div className="eventos-list-container">
            <h2>Próximos Eventos</h2>
            <div className="eventos-grid">
                {eventos.map(evento => (
                    <EventCard key={evento.id_evento} evento={evento} />
                ))}
            </div>
        </div>
    );
};

export default EventosList;