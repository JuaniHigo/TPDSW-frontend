import { useState, useEffect, type ReactNode } from 'react';
import { PurchaseContext, type PurchaseState } from './PurchaseContextDef';

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
    // 1. Al iniciar, intentamos leer los datos guardados en la sesión del navegador.
    // Si no hay nada, usamos los valores por defecto.
    const [purchase, setPurchase] = useState<PurchaseState>(() => {
        const savedPurchase = sessionStorage.getItem('purchase');
        return savedPurchase ? JSON.parse(savedPurchase) : {
            eventoId: null,
            sectorId: null,
            quantity: 1
        };
    });

    // 2. Este "efecto" se ejecuta cada vez que el estado 'purchase' cambia.
    // Guarda la nueva información en la sesión del navegador.
    useEffect(() => {
        sessionStorage.setItem('purchase', JSON.stringify(purchase));
    }, [purchase]);

    return (
        <PurchaseContext.Provider value={{ purchase, setPurchase }}>
            {children}
        </PurchaseContext.Provider>
    );
};