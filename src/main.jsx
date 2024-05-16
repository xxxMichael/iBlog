import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './componentesFront/Main/Main.jsx';

const rootElement = document.getElementById('root');

// Usando la nueva API createRoot en React 18
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
  