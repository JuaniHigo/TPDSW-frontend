import { act, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PaginaPago from '../../src/pages/PaginaPago';
import { PurchaseContext } from '../../src/context/PurchaseContextDef';
import api from '../../src/services/api';

vi.mock('../../src/hooks/usePaymentConfig', () => ({
  usePaymentConfig: () => ({
    config: { mode: 'demo', purchasesEnabled: true },
    error: '',
  }),
}));
vi.mock('../../src/components/ResumenEvento', () => ({ default: () => null }));

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('checkout errors', () => {
  it.each(['TOO_MANY_PENDING', 'RATE_LIMITED'])(
    'shows the backend message and pauses retries for %s',
    async (code) => {
      vi.useFakeTimers();
      const message = 'Esperá unos segundos antes de volver a intentar.';
      const post = vi.spyOn(api, 'post').mockRejectedValue({
        isAxiosError: true,
        response: { status: 429, data: { code, message } },
      });
      render(
        <PurchaseContext.Provider
          value={{
            purchase: {
              eventoId: 1,
              sectorId: 2,
              quantity: 1,
              idempotencyKey: 'checkout-key',
            },
            setPurchase: vi.fn(),
            clearPurchase: vi.fn(),
          }}
        >
          <MemoryRouter initialEntries={['/evento/1/comprar']}>
            <Routes>
              <Route path="/evento/:id/comprar" element={<PaginaPago />} />
            </Routes>
          </MemoryRouter>
        </PurchaseContext.Provider>,
      );
      const button = screen.getByRole('button', { name: 'Continuar al pago demo' });
      await act(async () => fireEvent.click(button));
      expect(screen.getByRole('alert')).toHaveTextContent(message);
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(post).toHaveBeenCalledTimes(1);
      const link = screen.queryByRole('link', { name: 'Ver estado de la compra' });
      if (code === 'TOO_MANY_PENDING') {
        expect(link).toHaveAttribute('href', '/mis-entradas');
      } else {
        expect(link).toBeNull();
      }
      act(() => vi.advanceTimersByTime(4999));
      expect(button).toBeDisabled();
      act(() => vi.advanceTimersByTime(1));
      expect(button).toBeEnabled();
      await act(async () => fireEvent.click(button));
      expect(post).toHaveBeenLastCalledWith(
        '/pagos/crear-preferencia',
        { eventoId: 1, sectorId: 2, quantity: 1 },
        { headers: { 'Idempotency-Key': 'checkout-key' } },
      );
    },
  );
});
