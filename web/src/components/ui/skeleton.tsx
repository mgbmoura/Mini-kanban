// Importa a função `cn`, um utilitário para mesclar e condicionalmente aplicar classes do Tailwind CSS.
import { cn } from "./utils";

/**
 * Componente Skeleton.
 * 
 * Renderiza um elemento visual para ser usado como um placeholder de carregamento.
 * Ele exibe uma animação de pulso suave para indicar que o conteúdo está sendo carregado.
 * 
 * @param {React.ComponentProps<"div">} props - As propriedades padrão de uma div, incluindo `className`.
 *        `className` pode ser usado para customizar o tamanho, a forma (ex: `rounded-full`) e outras
 *        propriedades do esqueleto, enquanto as classes base cuidam da cor de fundo e da animação.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton" // Atributo de dados para identificação e estilização se necessário.
      // `cn` combina as classes padrão do esqueleto com quaisquer classes customizadas passadas via `className`.
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props} // Passa quaisquer outras props de div (como `style`, `id`, etc.) para o elemento.
    />
  );
}

// Exporta o componente para ser utilizado em outras partes da aplicação.
export { Skeleton };
