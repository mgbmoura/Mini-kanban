
// Importa a função `createRoot` da biblioteca "react-dom/client", essencial para inicializar a aplicação com as APIs mais recentes do React.
import { createRoot } from "react-dom/client";
// Importa o componente `App`, que é o componente raiz da aplicação.
import App from "./app/App.tsx";
// Importa os estilos globais que serão aplicados em toda a aplicação.
import "./styles/index.css";
// Importa o ThemeProvider que acabamos de criar.
import { ThemeProvider } from "./contexts/ThemeContext.tsx";

// Ponto de entrada da aplicação: localiza o elemento com ID 'root' e renderiza a aplicação.
createRoot(document.getElementById("root")!).render(
  // Envolve toda a aplicação com o ThemeProvider.
  // Isto permite que qualquer componente aceda ao estado do tema.
  // Definimos 'light' como o tema padrão, que vamos criar a seguir.
  <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);
