import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { ProvedorTema } from './contexts/ContextoTema.tsx';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <ProvedorTema temaPadrao="light" chaveArmazenamento="mini-kanban-theme">
    <App />
  </ProvedorTema>,
);
