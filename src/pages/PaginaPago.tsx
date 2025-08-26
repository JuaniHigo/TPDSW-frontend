import { useState, useEffect } from 'react';
import { initMercadoPago } from '@mercadopago/sdk-react';
import api from '../services/api';
import FormularioTarjeta from '../components/FormularioTarjeta';
import MercadoPagoButton from '../components/MercadoPagoButton';
import ResumenEvento from '../components/ResumenEvento'; // 1. Importar el nuevo componente
import { usePurchase } from '../hooks/usePurchase';
import './PaginaPago.css';

const PaginaPago = () => {
    const { purchase } = usePurchase();
    const [metodoPago, setMetodoPago] = useState<'tarjeta' | 'mercadopago' | null>('tarjeta'); // Inicia en tarjeta por defecto
    const [preferenceId, setPreferenceId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY as string, {
            locale: 'es-AR'
        });
    }, []);

    const handleCrearPreferencia = async () => {
        if (!purchase.eventoId || !purchase.sectorId) {
            setError('Error: Debes seleccionar un evento y sector primero.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/pagos/crear-preferencia-mp', {
                eventoId: purchase.eventoId,
                sectorId: purchase.sectorId,
                quantity: purchase.quantity,
            });
            setPreferenceId(response.data.preferenceId);
        } catch (err: unknown) {
            setError('No se pudo generar el enlace de pago.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSeleccionarMercadoPago = () => {
        setMetodoPago('mercadopago');
        // Solo creamos la preferencia si aún no se ha creado
        if (!preferenceId) {
            handleCrearPreferencia();
        }
    };

    return (
        <div className="pagina-pago-layout">
            <div className="pago-panel-izquierdo">
                <h1>Elige tu método de pago</h1>
                <div className="metodos-pago">
                    <button 
                        onClick={() => setMetodoPago('tarjeta')}
                        className={metodoPago === 'tarjeta' ? 'active' : ''}
                    >
                        Tarjeta de Crédito/Débito
                    </button>
                    <button 
                        onClick={handleSeleccionarMercadoPago}
                        className={metodoPago === 'mercadopago' ? 'active' : ''}
                    >
                        Mercado Pago
                    </button>
                </div>
                <div className="pago-content">
                    {metodoPago === 'tarjeta' && <FormularioTarjeta />}
                    {metodoPago === 'mercadopago' && (
                        <div className="mercadopago-wallet-container">
                            {loading && <p>Generando enlace de pago...</p>}
                            {error && <p className="error-message">{error}</p>}
                            {preferenceId && !loading && !error && (
                                <MercadoPagoButton preferenceId={preferenceId} />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="pago-panel-derecho">
                <h2>Resumen de tu compra</h2>
                <ResumenEvento />
            </div>
        </div>
    );
};

export default PaginaPago;
