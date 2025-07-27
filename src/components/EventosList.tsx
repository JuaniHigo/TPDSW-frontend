import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Definimos la forma que tienen los datos de un evento
interface Evento {
    id_evento: number;
    nombre_local: string;
    nombre_visitante: string;
    nombre_estadio: string;
    fecha_hora: string;
}

const EventosList: React.FC = () => {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Hacemos la llamada a la API
        api.get('/eventos')
            .then(response => {
                // Guardamos los datos que vienen dentro de la propiedad "data"
                setEventos(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error al obtener los eventos:", error);
                setLoading(false);
            });
    }, []); // El array vacío [] asegura que se ejecute solo una vez

    if (loading) {
        return <p>Cargando eventos...</p>;
    }

    return (
        <div>
            <h1>Próximos Eventos</h1>
            <ul>
                {eventos.map(evento => (
                    <li key={evento.id_evento}>
                        <strong>{evento.nombre_local} vs {evento.nombre_visitante}</strong>
                        <p>Estadio: {evento.nombre_estadio}</p>
                        <p>Fecha: {new Date(evento.fecha_hora).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventosList;