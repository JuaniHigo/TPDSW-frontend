import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  PurchaseContext,
  emptyPurchase,
  type PurchaseState,
} from './PurchaseContextDef';
function restore(): PurchaseState {
  try {
    const data = JSON.parse(
      sessionStorage.getItem('purchase') || 'null',
    ) as PurchaseState | null;
    if (
      data &&
      Number.isInteger(data.eventoId) &&
      Number.isInteger(data.sectorId) &&
      Number.isInteger(data.quantity) &&
      data.quantity > 0 &&
      data.quantity <= 100
    )
      return data;
  } catch {
    /* discard malformed browser state */
  }
  return emptyPurchase;
}
export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [purchase, setPurchase] = useState<PurchaseState>(restore);
  const clearPurchase = useCallback(() => setPurchase(emptyPurchase), []);
  useEffect(() => {
    sessionStorage.setItem('purchase', JSON.stringify(purchase));
  }, [purchase]);
  useEffect(() => {
    const clear = () => setPurchase(emptyPurchase);
    window.addEventListener('kicket:clear-purchase', clear);
    return () => window.removeEventListener('kicket:clear-purchase', clear);
  }, []);
  return (
    <PurchaseContext.Provider value={{ purchase, setPurchase, clearPurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
};
