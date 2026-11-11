import { createContext } from 'react';
export interface PurchaseState {
  eventoId: number | null;
  sectorId: number | null;
  quantity: number;
  idempotencyKey?: string;
}
export interface PurchaseContextType {
  purchase: PurchaseState;
  setPurchase: (value: PurchaseState) => void;
  clearPurchase: () => void;
}
export const emptyPurchase: PurchaseState = {
  eventoId: null,
  sectorId: null,
  quantity: 1,
};
export const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined,
);
