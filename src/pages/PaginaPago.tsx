import { useEffect, useState } from 'react';
import { isAxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
import { usePurchase } from '../hooks/usePurchase';
import api, { errorMessage } from '../services/api';
import ResumenEvento from '../components/ResumenEvento';
import { usePaymentConfig } from '../hooks/usePaymentConfig';
import DemoNotice from '../components/DemoNotice';
import './PaginaPago.css';
const RETRY_DELAY_MS = 5000;
export default function PaginaPago() {
  const { config, error: configError } = usePaymentConfig();
  const { purchase, setPurchase } = usePurchase(),
    id = Number(useParams().id);
  const [loading, setLoading] = useState(false),
    [error, setError] = useState('');
  const [compraId, setCompraId] = useState<number | null>(null);
  const [rateLimited, setRateLimited] = useState(false),
    [tooManyPending, setTooManyPending] = useState(false);
  useEffect(() => {
    if (!rateLimited) return;
    const timeout = window.setTimeout(() => setRateLimited(false), RETRY_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [rateLimited]);
  const valid =
    purchase.eventoId === id && purchase.sectorId && purchase.quantity > 0;
  async function pay() {
    if (!valid || !config?.purchasesEnabled || loading || rateLimited) return;
    setLoading(true);
    setError('');
    setTooManyPending(false);
    const key = purchase.idempotencyKey || crypto.randomUUID();
    setPurchase({ ...purchase, idempotencyKey: key });
    try {
      const { data } = await api.post<{
        idCompra: number;
        checkoutUrl: string;
      }>(
        '/pagos/crear-preferencia',
        {
          eventoId: id,
          sectorId: purchase.sectorId,
          quantity: purchase.quantity,
        },
        { headers: { 'Idempotency-Key': key } },
      );
      sessionStorage.setItem('lastCompraId', String(data.idCompra));
      window.location.assign(data.checkoutUrl);
    } catch (e) {
      if (isAxiosError<{ code?: string; errors?: { idCompra?: number } }>(e)) {
        if (e.response?.status === 429) setRateLimited(true);
        setTooManyPending(e.response?.data.code === 'TOO_MANY_PENDING');
        const compra = e.response?.data.errors?.idCompra;
        if (compra) {
          setCompraId(compra);
          sessionStorage.setItem('lastCompraId', String(compra));
        }
      }
      setError(errorMessage(e));
      setLoading(false);
    }
  }
  return (
    <div className="pagina-pago-layout">
      <div className="pago-panel-izquierdo">
        <h1>Confirmá tu compra</h1>
        {valid ? (
          <>
            {config &&
              (config.mode === 'demo' ? (
                <DemoNotice />
              ) : (
                <p>Pagá con los medios disponibles en Mercado Pago.</p>
              ))}
            <p>
              Tu cupo se reservará por hasta 15 minutos al abrir el pago. Los
              pagos aprobados después del vencimiento se reembolsarán.
            </p>
            {config && !config.purchasesEnabled && (
              <p>Las compras están temporalmente deshabilitadas.</p>
            )}
            <button
              disabled={loading || rateLimited || !config?.purchasesEnabled}
              onClick={() => void pay()}
            >
              {loading
                ? 'Preparando pago...'
                : !config
                  ? 'Cargando opciones de pago...'
                  : config.mode === 'demo'
                    ? 'Continuar al pago demo'
                    : 'Pagar con Mercado Pago'}
            </button>
          </>
        ) : (
          <p>Seleccioná un sector y cantidad antes de pagar.</p>
        )}
        {error && <p role="alert">{error}</p>}
        {configError && <p role="alert">{configError}</p>}
        {tooManyPending && (
          <p>
            <Link to="/mis-entradas">Ver estado de la compra</Link>
          </p>
        )}
        {compraId && (
          <p>
            <Link to={'/compra-pendiente?external_reference=' + compraId}>
              Ver estado de la compra
            </Link>
          </p>
        )}
        <Link to={'/evento/' + id}>Volver al evento</Link>
      </div>
      <div className="pago-panel-derecho">
        <ResumenEvento />
      </div>
    </div>
  );
}
