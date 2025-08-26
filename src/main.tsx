import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { PurchaseProvider } from './context/PurchaseContext.tsx';
import App from './App.tsx';
import './index.css';
import 'react-datepicker/dist/react-datepicker.css';

// La inicialización de Mercado Pago está bien aquí
const publicKey = import.meta.env.VITE_MP_PUBLIC_KEY;
if (publicKey) {
  // Ya no necesitas importar initMercadoPago, se maneja en PaginaPago.tsx
} else {
  console.error("VITE_MP_PUBLIC_KEY no está definida.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. El Router envuelve todo */}
    <BrowserRouter>
      {/* 2. Los proveedores de contexto anidados */}
      <AuthProvider>
        <PurchaseProvider>
          {/* 3. Finalmente, la App */}
          <App />
        </PurchaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);