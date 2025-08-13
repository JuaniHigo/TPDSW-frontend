// src/components/FloatingTickets.tsx
import './FloatingTickets.css';
import ticketImage from '../assets/ticket.png';

const FloatingTickets = () => {
    const tickets = Array.from({ length: 15 });

    return (
        <div className="floating-tickets-container">
            {tickets.map((_, index) => (
                <div
                    key={index}
                    className="ticket"
                    style={{
                        left: `${Math.random() * 100}%`,
                        // 1. Reducimos la demora máxima de 10s a 1s
                        // Esto hará que los tickets empiecen a aparecer casi de inmediato.
                        animationDelay: `${Math.random() * 1}s`,

                        // 2. Reducimos la duración para que se muevan un poco más rápido
                        animationDuration: `${4 + Math.random() * 4}s`,
                    }}
                >
                    <img src={ticketImage} alt="Ticket flotante" />
                </div>
            ))}
        </div>
    );
};

export default FloatingTickets;
