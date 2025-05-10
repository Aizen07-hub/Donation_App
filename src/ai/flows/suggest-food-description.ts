// src/ai/flows/suggest-food-description.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting food descriptions for listings.
 *
 * - suggestFoodDescription - A function that suggests a food description.
 * - SuggestFoodDescriptionInput - The input type for the suggestFoodDescription function.
 * - SuggestFoodDescriptionOutput - The return type for the suggestFoodDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFoodDescriptionInputSchema = z.object({
  foodType: z.string().describe('The type of food (e.g., Pizza, Bakery, Sandwiches).'),
  quantity: z.string().describe('The approximate quantity of the food (e.g., 5 Pizzas, 2 large boxes).'),
});

export type SuggestFoodDescriptionInput = z.infer<typeof SuggestFoodDescriptionInputSchema>;

const SuggestFoodDescriptionOutputSchema = z.object({
  suggestedDescription: z
    .string()
    .describe(
      'A concise and appealing description for the food listing (2-3 sentences max).'
    ),
});

export type SuggestFoodDescriptionOutput = z.infer<typeof SuggestFoodDescriptionOutputSchema>;

export async function suggestFoodDescription(
  input: SuggestFoodDescriptionInput
): Promise<SuggestFoodDescriptionOutput> {
  return suggestFoodDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFoodDescriptionPrompt',
  input: {schema: SuggestFoodDescriptionInputSchema},
  output: {schema: SuggestFoodDescriptionOutputSchema},
  prompt: `You are an AI assistant helping to write appealing descriptions for surplus food listings.
  Based on the food type and quantity provided, generate a concise and enticing description (2-3 sentences maximum).
  Highlight freshness or key attributes if appropriate. Avoid using phrases like "Surplus food" or "leftover". Focus on the appeal of the food itself.

  Food Type: {{{foodType}}}
  Quantity: {{{quantity}}}

  Your response should be formatted as a JSON object with a "suggestedDescription" field.
  Example: If food type is "Pepperoni and Veggie Pizzas" and quantity is "5 large pizzas", a good description could be:
  "Enjoy a variety of delicious pepperoni and veggie pizzas! Perfect for a group meal, these 5 large pizzas are ready for pickup."
  `,
});

const suggestFoodDescriptionFlow = ai.defineFlow(
  {
    name: 'suggestFoodDescriptionFlow',
    inputSchema: SuggestFoodDescriptionInputSchema,
    outputSchema: SuggestFoodDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
