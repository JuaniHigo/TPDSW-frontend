import { createContext } from 'react';

// 1. Definimos y exportamos las interfaces (los "tipos" de datos)
export interface PurchaseState {
    eventoId: string | null;
    sectorId: string | null;
    quantity: number;
}

export interface PurchaseContextType {
    purchase: PurchaseState;
    setPurchase: (purchase: PurchaseState) => void;
}

// 2. Creamos y exportamos el objeto Context
export const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);