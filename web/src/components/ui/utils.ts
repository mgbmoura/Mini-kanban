// Importa a função `clsx` e o tipo `ClassValue` da biblioteca `clsx`.
// `clsx` é uma pequena biblioteca para construir strings de `className` de forma condicional.
import { clsx, type ClassValue } from "clsx";
// Importa a função `twMerge` da biblioteca `tailwind-merge`.
// `twMerge` é uma função que mescla inteligentemente classes do Tailwind CSS, resolvendo conflitos.
import { twMerge } from "tailwind-merge";

/**
 * Função utilitária `cn` (abreviação de "class names").
 * 
 * Esta função combina o poder do `clsx` e do `tailwind-merge` para criar uma maneira robusta
 * de definir classes CSS em componentes React, especialmente ao usar Tailwind CSS.
 * 
 * 1. `clsx(inputs)`: Pega todos os argumentos (strings, objetos, arrays) e os converte
 *    em uma única string de classes. Isso é útil para aplicar classes condicionalmente.
 *    Ex: `clsx('btn', { 'btn-primary': isPrimary })` -> `"btn btn-primary"` se `isPrimary` for true.
 * 
 * 2. `twMerge(...)`: Pega a string de classes gerada pelo `clsx` e resolve quaisquer conflitos
 *    do Tailwind CSS. Por exemplo, se a string for "p-2 p-4", `twMerge` irá remover `p-2`
 *    e manter apenas `p-4`, que é a última e, portanto, a que tem precedência.
 *    Ex: `twMerge('bg-red-500 bg-blue-500')` -> `"bg-blue-500"`.
 * 
 * @param {...ClassValue[]} inputs - Uma sequência de valores de classe (strings, objetos, etc.).
 * @returns {string} Uma string de classes CSS otimizada e sem conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
