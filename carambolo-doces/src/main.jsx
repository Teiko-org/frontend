import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// Importar toast customizado ANTES de qualquer outro código
import './utils/toast';
import App from './App';
import './utils/authUtils'; // Importar utilitários de autenticação

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);