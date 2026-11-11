import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../services/api';
import type { Compra, DemoCheckout, DemoResult } from '../types/api';
import DemoNotice from '../components/DemoNotice';
import './PaginaPago.css';
export default function PagoDemo() {
  const { idCompra } = useParams(),
    navigate = useNavigate();
  const [compra, setCompra] = useState<DemoCheckout | null>(null),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setCompra(null);
    api
      .get<DemoCheckout>('/pagos/demo/' + idCompra)
      .then((r) => {
        if (active) setCompra(r.data);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [idCompra]);
  async function simulate(resultado: DemoResult) {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const { data } = await api.post<Compra>(
        '/pagos/demo/' + idCompra + '/simular',
        { resultado },
      );
      const route =
        data.estado === 'completada'
          ? '/compra-exitosa'
          : data.estado === 'rechazada'
            ? '/compra-fallida'
            : '/compra-pendiente';
      navigate(route + '?external_reference=' + data.idCompra, {
        replace: true,
      });
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }
  if (loading) return <p>Cargando pago demo...</p>;
  if (!compra)
    return (
      <div className="pagina-pago-layout">
        <p role="alert">{error || 'Compra demo no encontrada'}</p>
      </div>
    );
  const expired =
    !!compra.expiresAt && new Date(compra.expiresAt).getTime() <= Date.now();
  return (
    <div className="pagina-pago-layout pago-demo-layout">
      <section className="pago-panel-izquierdo">
        <h1>Simulador de pago</h1>
        <DemoNotice />
        <div className="demo-summary">
          <p>Compra #{compra.idCompra}</p>
          {compra.snapshot && (
            <>
              <h2>
                {compra.snapshot.nombreLocal} vs{' '}
                {compra.snapshot.nombreVisitante}
              </h2>
              <p>
                {compra.snapshot.nombreSector} · {compra.quantity} entradas
              </p>
            </>
          )}
          <p>
            <strong>
              Total: $ {compra.montoTotal} {compra.moneda}
            </strong>
          </p>
          <p>Estado: {compra.estado}</p>
          {compra.expiresAt && (
            <p>
              Vencimiento de la reserva:{' '}
              {new Date(compra.expiresAt).toLocaleString('es-AR', {
                timeZone: 'America/Argentina/Buenos_Aires',
                hour12: false,
              })}
            </p>
          )}
        </div>
        {(expired || compra.estado === 'cancelada') &&
          compra.actions.includes('approved') && (
            <p>
              La aprobación será tardía y se simulará un reembolso. No se
              emitirán entradas.
            </p>
          )}
        {compra.actions.length > 0 ? (
          <>
            <p>Elegí el resultado de la simulación:</p>
            <div className="demo-actions">
              <button
                disabled={busy || !compra.actions.includes('approved')}
                onClick={() => void simulate('approved')}
              >
                Aprobar pago
              </button>
              <button
                disabled={busy || !compra.actions.includes('rejected')}
                onClick={() => void simulate('rejected')}
              >
                Rechazar pago
              </button>
              <button
                disabled={busy || !compra.actions.includes('pending')}
                onClick={() => void simulate('pending')}
              >
                Dejar pendiente
              </button>
            </div>
          </>
        ) : (
          <p>Esta compra no tiene acciones de simulación disponibles.</p>
        )}
        {error && <p role="alert">{error}</p>}
        <p>
          <Link to={'/compra-pendiente?external_reference=' + compra.idCompra}>
            Ver estado de la compra
          </Link>
        </p>
        <Link to="/mis-entradas">Mis entradas</Link>
      </section>
    </div>
  );
}
