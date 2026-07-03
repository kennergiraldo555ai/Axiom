import type { PromptFunction } from "../types";

export interface EvaluateProspectInput {
  companyName: string;
  category: string;
  location: string;
  websiteUrl?: string;
  additionalInfo?: string;
}

export const evaluateProspectPrompt: PromptFunction<EvaluateProspectInput> = (input) => {
  return {
    systemPrompt: `You are an expert B2B sales analyst for AXIOM. Your job is to evaluate potential prospects based on their public footprint. Provide a JSON response containing an evaluation score (1-100) and a concise rationale.`,
    userPrompt: `Evaluate the following prospect:
Company: ${input.companyName}
Category: ${input.category}
Location: ${input.location}
Website: ${input.websiteUrl ?? "N/A"}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ""}

Output format requirements:
{
  "score": number, // 1 to 100
  "rationale": "string" // Max 2 sentences explaining the score
}`,
  };
};
