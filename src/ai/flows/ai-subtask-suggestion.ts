'use server';
/**
 * @fileOverview An AI agent that suggests sub-tasks based on a main task description.
 *
 * - suggestSubtasks - A function that handles the sub-task suggestion process.
 * - AiSubtaskSuggestionInput - The input type for the suggestSubtasks function.
 * - AiSubtaskSuggestionOutput - The return type for the suggestSubtasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiSubtaskSuggestionInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('The description of the main task for which sub-tasks are needed.'),
});
export type AiSubtaskSuggestionInput = z.infer<
  typeof AiSubtaskSuggestionInputSchema
>;

const AiSubtaskSuggestionOutputSchema = z.object({
  subtasks: z
    .array(z.string())
    .describe('A list of suggested sub-tasks or action items.'),
});
export type AiSubtaskSuggestionOutput = z.infer<
  typeof AiSubtaskSuggestionOutputSchema
>;

export async function suggestSubtasks(
  input: AiSubtaskSuggestionInput
): Promise<AiSubtaskSuggestionOutput> {
  return aiSubtaskSuggestionFlow(input);
}

const aiSubtaskSuggestionPrompt = ai.definePrompt({
  name: 'aiSubtaskSuggestionPrompt',
  input: {schema: AiSubtaskSuggestionInputSchema},
  output: {schema: AiSubtaskSuggestionOutputSchema},
  prompt: `You are an AI assistant specialized in breaking down complex tasks into smaller, actionable sub-tasks.

Given the following main task description, generate a list of relevant sub-tasks or action items. Ensure the sub-tasks are clear, concise, and help in progressing towards the completion of the main task.

Main Task Description: {{{taskDescription}}}

Provide the output as a JSON object with a single field 'subtasks', which is an array of strings.`,
});

const aiSubtaskSuggestionFlow = ai.defineFlow(
  {
    name: 'aiSubtaskSuggestionFlow',
    inputSchema: AiSubtaskSuggestionInputSchema,
    outputSchema: AiSubtaskSuggestionOutputSchema,
  },
  async input => {
    const {output} = await aiSubtaskSuggestionPrompt(input);
    return output!;
  }
);
