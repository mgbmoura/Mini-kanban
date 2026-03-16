// Importa o componente `Skeleton`, que é a base para criar os elementos de carregamento.
import { Skeleton } from './ui/skeleton';

/**
 * Componente LoginSkeleton.
 * 
 * Exibe uma versão "esquelética" da tela de login, mostrando uma UI de carregamento
 * que imita a estrutura da página real. Isso melhora a experiência do usuário,
 * fornecendo um feedback visual de que o conteúdo está sendo preparado, especialmente
 * em casos de lazy loading ou espera por dados de autenticação.
 */
export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#16161f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Skeleton para o Logo e Título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-2">
            <Skeleton className="w-12 h-12 rounded-lg bg-gray-700" />
          </div>
          <Skeleton className="w-40 h-8 mx-auto bg-gray-700 mb-2" />
          <Skeleton className="w-24 h-4 mx-auto bg-gray-700" />
        </div>

        {/* Skeleton para o Formulário de Login */}
        <div className="bg-[#1e1e2e] rounded-lg p-6 border border-gray-800">
          <div className="space-y-6">
            
            {/* Skeleton para o primeiro campo de input (Email) */}
            <div>
              <Skeleton className="w-20 h-4 mb-2 bg-gray-700" />
              <Skeleton className="w-full h-11 bg-gray-700 rounded-lg" />
            </div>
            
            {/* Skeleton para o segundo campo de input (Senha) */}
            <div>
              <Skeleton className="w-20 h-4 mb-2 bg-gray-700" />
              <Skeleton className="w-full h-11 bg-gray-700 rounded-lg" />
            </div>

            {/* Skeleton para o botão de login */}
            <Skeleton className="w-full h-11 bg-violet-800/50 rounded-lg" />
          </div>

          {/* Skeleton para o link "Esqueci minha senha" */}
          <div className="mt-6 text-center">
             <Skeleton className="w-48 h-4 mx-auto bg-gray-700" />
          </div>
        </div>

        {/* Skeleton para o texto do rodapé */}
        <div className="mt-6 text-center">
          <Skeleton className="w-64 h-3 mx-auto bg-gray-700" />
        </div>
      </div>
    </div>
  );
}
