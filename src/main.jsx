import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './componentesFront/Main/Main.jsx';

// Verifica si el elemento con id "root" está presente en el DOM
const rootElement = document.getElementById('root');

if (rootElement) {
  // Usando la nueva API createRoot en React 18
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Main />
    </React.StrictMode>
  );
} else {
  console.error('No se encontró un elemento con el id "root".');
}
  