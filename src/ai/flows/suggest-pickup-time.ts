// src/ai/flows/suggest-pickup-time.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting optimal pickup times for surplus food donations.
 *
 * - suggestPickupTime - A function that suggests optimal pickup times.
 * - SuggestPickupTimeInput - The input type for the suggestPickupTime function.
 * - SuggestPickupTimeOutput - The return type for the suggestPickupTime function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPickupTimeInputSchema = z.object({
  closingTime: z
    .string()
    .describe("The restaurant's closing time in HH:mm format (e.g., 22:00)."),
  donationSize: z
    .string()
    .describe(
      'The approximate size of the food donation (e.g., small, medium, large).'
    ),
  foodType: z.string().describe('The type of food being donated (e.g., pizza, pasta, salad).'),
});

export type SuggestPickupTimeInput = z.infer<typeof SuggestPickupTimeInputSchema>;

const SuggestPickupTimeOutputSchema = z.object({
  suggestedPickupTime: z
    .string()
    .describe(
      'The suggested optimal pickup time in HH:mm format (e.g., 21:00).'
    ),
  reasoning: z
    .string()
    .describe(
      'The reasoning behind the suggested pickup time, considering closing time and donation size.'
    ),
});

export type SuggestPickupTimeOutput = z.infer<typeof SuggestPickupTimeOutputSchema>;

export async function suggestPickupTime(
  input: SuggestPickupTimeInput
): Promise<SuggestPickupTimeOutput> {
  return suggestPickupTimeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPickupTimePrompt',
  input: {schema: SuggestPickupTimeInputSchema},
  output: {schema: SuggestPickupTimeOutputSchema},
  prompt: `You are an AI assistant helping restaurants determine the best pickup time for surplus food donations.

  Consider the restaurant's closing time and the size of the donation to suggest an optimal pickup time.
  The goal is to minimize food waste while ensuring the pickup doesn't disrupt the restaurant's operations.

  Closing Time: {{{closingTime}}}
  Donation Size: {{{donationSize}}}
  Food Type: {{{foodType}}}

  Suggest an optimal pickup time and explain your reasoning.
  Your response should be formatted as a JSON object with "suggestedPickupTime" and "reasoning" fields.
  Ensure that suggestedPickupTime is in HH:mm format.
  `,
});

const suggestPickupTimeFlow = ai.defineFlow(
  {
    name: 'suggestPickupTimeFlow',
    inputSchema: SuggestPickupTimeInputSchema,
    outputSchema: SuggestPickupTimeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
