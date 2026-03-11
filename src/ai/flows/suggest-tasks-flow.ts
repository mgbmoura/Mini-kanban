'use server';
/**
 * @fileOverview Fluxo de IA para sugerir subtarefas baseadas na descrição.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestSubtasksInputSchema = z.object({
  description: z.string().describe('A descrição da tarefa principal.'),
});

const SuggestSubtasksOutputSchema = z.object({
  subtasks: z.array(z.string()).describe('Uma lista de subtarefas sugeridas.'),
});

export async function suggestSubtasks(input: z.infer<typeof SuggestSubtasksInputSchema>) {
  const { output } = await ai.generate({
    model: 'googleai/gemini-2.0-flash-exp',
    input: input,
    output: { schema: SuggestSubtasksOutputSchema },
    system: 'Você é um gerente de projetos especializado em quebrar tarefas complexas em subtarefas simples e acionáveis.',
    prompt: `Com base na seguinte descrição de tarefa, sugira 3 a 5 subtarefas curtas:
    
    Descrição: {{{description}}}`,
  });

  return output!;
}
