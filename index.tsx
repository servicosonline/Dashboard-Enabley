
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Elemento 'root' não encontrado no HTML.");
  }

  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err: any) {
  console.error("Falha na renderização:", err);
  const msgEl = document.getElementById('error-message');
  if (msgEl) {
    document.getElementById('error-display')!.style.display = 'block';
    msgEl.textContent = "Erro de Inicialização: " + err.message;
  }
}
