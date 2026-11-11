import { useEffect, useState } from 'react';
import api, { errorMessage } from '../services/api';
import type { PaymentConfig } from '../types/api';
export function usePaymentConfig() {
  const [config, setConfig] = useState<PaymentConfig | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    api
      .get<PaymentConfig>('/pagos/configuracion')
      .then((r) => {
        if (active) setConfig(r.data);
      })
      .catch((e) => {
        if (active) setError(errorMessage(e));
      });
    return () => {
      active = false;
    };
  }, []);
  return { config, error };
}
