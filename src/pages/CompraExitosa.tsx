import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../services/api';
import Modal from '../components/Modal';
import './CompraExitosa.css';

// Interfaz simplificada
interface Entrada {
    id_entrada: number;
    codigo_qr: string;
    nombre_local: string;
    nombre_visitante: string;
}

const CompraExitosa = () => {
    const [showModal, setShowModal] = useState(true);
    const [entradas, setEntradas] = useState<Entrada[]>([]);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const compraId = params.get('external_reference');

        if (compraId) {
            api.get(`/pagos/compras/${compraId}/entradas`)
                .then(response => setEntradas(response.data))
                .catch(error => console.error("Error al obtener las entradas:", error));
        }
    }, [location.search]);

    return (
        <>
            <div className="compra-exitosa-container">
                <h1>¡Tu compra se realizó con éxito!</h1>
                <p>Aquí están tus entradas. Podrás encontrarlas también en la sección "Mis Entradas".</p>
                <div className="entradas-grid">
                    {entradas.map(entrada => (
                        <div key={entrada.id_entrada} className="entrada-card">
                            <h3>{entrada.nombre_local} vs {entrada.nombre_visitante}</h3>
                            <div className="qr-container">
                                {entrada.codigo_qr && <QRCode value={entrada.codigo_qr} size={180} bgColor="#FFFFFF" fgColor="#111827" />}
                            </div>
                            <p>Entrada #{entrada.id_entrada}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 style={{ color: 'white', marginTop: 0 }}>¡Gracias por tu compra!</h2>
                <p style={{ color: '#d1d5db' }}>Tus entradas han sido generadas y ya están listas para usar.</p>
                <button 
                    className="auth-submit-button" 
                    style={{ marginTop: '1rem' }}
                    onClick={() => setShowModal(false)}
                >
                    Ver mis entradas
                </button>
            </Modal>
        </>
    );
};

export default CompraExitosa;