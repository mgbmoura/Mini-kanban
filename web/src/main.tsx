import { createRoot } from 'react-dom/client';
import App from './app/App.tsx';
import { ProvedorTema } from './contexts/ContextoTema.tsx';
import './styles/index.css';

const raiz = document.getElementById('root');

if (!raiz) {
  throw new Error('Elemento raiz da aplicação não encontrado.');
}

createRoot(raiz).render(
  <ProvedorTema>
    <App />
  </ProvedorTema>,
);
