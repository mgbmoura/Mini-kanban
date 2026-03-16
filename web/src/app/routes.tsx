import { createBrowserRouter, Navigate } from "react-router-dom";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage"; // Corrigido para importação padrão
import { ResetPasswordPage } from "./pages/ResetPasswordPage";

/**
 * Cria um router para as rotas públicas da aplicação.
 * Estas são as rotas acessíveis por utilizadores não autenticados.
 */
export function createPublicRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <LoginPage onLogin={() => { /* Lógica de login aqui */ }} />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPasswordPage />,
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />,
    },
    // Redireciona qualquer outra rota não encontrada para a página de login.
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
  ]);
}
