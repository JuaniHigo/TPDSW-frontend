import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api, { errorMessage } from '../services/api';
import type { Compra, EntradaComprada } from '../types/api';
import EntradaCard from '../components/EntradaCard';
import { usePurchase } from '../hooks/usePurchase';
import './CompraExitosa.css';
import DemoNotice from '../components/DemoNotice';
import { usePaymentConfig } from '../hooks/usePaymentConfig';
const labels: Record<string, string> = {
  pendiente: 'Estamos esperando la confirmación del pago',
  completada: 'Tu compra se realizó con éxito',
  rechazada: 'El pago fue rechazado',
  vencida: 'La reserva venció',
  cancelada: 'El evento fue cancelado',
  reembolsoPendiente: 'Tu reembolso está pendiente',
  reembolsada: 'El pago fue reembolsado',
  revision: 'La compra requiere revisión',
};
export default function CompraExitosa() {
  const { config } = usePaymentConfig();
  const location = useLocation(),
    { clearPurchase } = usePurchase();
  const id =
    new URLSearchParams(location.search).get('external_reference') ||
    sessionStorage.getItem('lastCompraId');
  const [compra, setCompra] = useState<Compra | null>(null),
    [entradas, setEntradas] = useState<EntradaComprada[]>([]),
    [error, setError] = useState(''),
    [retry, setRetry] = useState(0),
    [waiting, setWaiting] = useState(true);
  useEffect(() => {
    let active = true,
      timer: ReturnType<typeof setTimeout> | undefined;
    const start = Date.now();
    async function poll() {
      if (!id || !/^\d+$/.test(id)) {
        setError('No se pudo identificar la compra');
        setWaiting(false);
        return;
      }
      try {
        const c = (await api.get<Compra>('/pagos/compras/' + id)).data;
        if (!active) return;
        setCompra(c);
        setError('');
        if (c.estado === 'completada') {
          const tickets = (
            await api.get<EntradaComprada[]>('/pagos/entradas/' + id)
          ).data;
          if (active) {
            setEntradas(tickets);
            setWaiting(false);
          }
          return;
        }
        if (
          ['pendiente', 'reembolsoPendiente'].includes(c.estado) &&
          Date.now() - start < 120000
        ) {
          timer = setTimeout(() => void poll(), 3000);
        } else setWaiting(false);
      } catch (e) {
        if (active) {
          setError(errorMessage(e));
          setWaiting(false);
        }
      }
    }
    setWaiting(true);
    void poll();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [id, retry]);
  useEffect(() => {
    if (
      compra &&
      ['completada', 'vencida', 'cancelada', 'reembolsada'].includes(
        compra.estado,
      )
    )
      clearPurchase();
  }, [compra, clearPurchase]);
  return (
    <div className="compra-exitosa-container">
      <h1>
        {compra
          ? labels[compra.estado] || 'Estado de compra'
          : 'Consultando compra'}
      </h1>
      {compra?.provider === 'demo' && <DemoNotice />}
      {error && <p role="alert">{error}</p>}
      {compra && (
        <p>
          Compra #{compra.idCompra} · $ {compra.montoTotal} {compra.moneda}
        </p>
      )}
      {waiting && <p>Actualizando estado...</p>}
      <div className="entradas-grid">
        {entradas.map((e) => (
          <EntradaCard key={e.idEntrada} entrada={e} />
        ))}
      </div>
      {!waiting && (
        <button onClick={() => setRetry((n) => n + 1)}>
          Actualizar estado
        </button>
      )}
      <p>
        {compra?.provider === 'demo' &&
          config?.mode === 'demo' &&
          config.purchasesEnabled &&
          ['pendiente', 'rechazada'].includes(compra.estado) && (
            <>
              <Link to={'/pago-demo/' + compra.idCompra}>
                Volver al pago demo
              </Link>
              <br />
            </>
          )}
        <Link to="/mis-entradas">Mis entradas</Link>
      </p>
    </div>
  );
}
