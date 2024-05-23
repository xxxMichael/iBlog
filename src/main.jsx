import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './componentesFront/Main/Main.jsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Perfil from './componentesFront/Home/Perfil.jsx';


// Verifica si el elemento con id "root" está presente en el DOM
const rootElement = document.getElementById('root');

if (rootElement) {
  // Usando la nueva API createRoot en React 18
  const root = createRoot(rootElement);

  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
} else {
  console.error('No se encontró un elemento con el id "root".');
}
