import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { PurchaseProvider } from './context/PurchaseContext';
import App from './App';
import './index.css';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PurchaseProvider>
          <App />
        </PurchaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
