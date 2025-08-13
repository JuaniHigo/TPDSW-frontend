import { useRef } from 'react';
import EventosList from './EventosList';
import './Home.css';
// 1. Importamos la imagen de fondo desde la carpeta de assets
import backgroundImage from '../assets/hinchada.jpg';

const Home = () => {
    const eventsSectionRef = useRef<HTMLDivElement>(null);

    const handleSearchClick = () => {
        if (eventsSectionRef.current) {
            eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="home-container">
            {/* 2. Aplicamos la imagen como un estilo en línea */}
            <section 
                className="hero-section-fullscreen"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="hero-title">Sentí la camiseta, viví el partido</h1>
                        <p className="hero-subtitle">Tu entrada a un clic de distancia.</p>
                        <button className="hero-button" onClick={handleSearchClick}>
                            Comprar Entradas
                        </button>
                    </div>
                </div>
            </section>

            {/* La lista de eventos ahora está separada */}
            <section ref={eventsSectionRef} className="events-section">
                <EventosList />
            </section>
        </div>
    );
};

export default Home;
