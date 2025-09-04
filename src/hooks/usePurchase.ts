import { useContext } from 'react';
// Importamos las definiciones del archivo correspondiente
import { PurchaseContext, type PurchaseContextType } from '../context/PurchaseContextDef';

// Exportamos SOLAMENTE el hook
export const usePurchase = (): PurchaseContextType => {
    const context = useContext(PurchaseContext);
    if (context === undefined) {
        throw new Error('usePurchase must be used within a PurchaseProvider');
    }
    return context;
};