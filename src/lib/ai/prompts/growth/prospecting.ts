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
    systemPrompt: `You are an expert B2B sales analyst for AXIOM. Your job is to evaluate potential prospects based on their public footprint. Provide a JSON response containing an evaluation score, a rationale, signals (strengths/weaknesses), and opportunities. Your output MUST be a valid JSON object.`,
    userPrompt: `Evaluate the following prospect:
Company: ${input.companyName}
Category: ${input.category}
Location: ${input.location}
Website: ${input.websiteUrl ?? "N/A"}
${input.additionalInfo ? `Additional Info: ${input.additionalInfo}` : ""}

Calculate the "Opportunity Score" (0-100) specifically considering:
1. Reputación y número de reseñas
2. Presencia web y uso de redes sociales
3. Calidad del negocio (horarios, status)
4. Dolores encontrados (ej. falta de sitio web, malas reseñas)
5. Oportunidades comerciales
6. Potencial de automatización y potencial de ventas

Output format requirements:
{
  "qualityScore": number, // 0 to 100 based on the criteria above
  "scoreRationale": {
    "summary": "string" // Max 3 sentences executive summary explaining the score and business context
  },
  "signals": {
    "strengths": ["string"], // List of key strengths
    "weaknesses": ["string"] // List of key problems or pain points
  },
  "opportunities": [
    {
      "type": "string", // Short type, e.g., "website_redesign", "seo_optimization"
      "description": "string" // Why they need this solution
    }
  ]
}`,
  };
};
