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
    systemPrompt: `Eres un analista experto en ventas B2B para AXIOM. Tu trabajo es evaluar posibles clientes (prospectos) basándote en su huella pública.
Proporciona una respuesta en formato JSON que contenga un puntaje de oportunidad, una justificación, señales (fortalezas/debilidades) y oportunidades.
CRÍTICO: Todo tu análisis (el contenido de los strings) DEBE estar en ESPAÑOL neutro, profesional y orientado a ventas en Latinoamérica.
Tu salida DEBE ser un objeto JSON válido y exacto a la estructura solicitada.`,
    userPrompt: `Evalúa el siguiente prospecto:
Empresa: ${input.companyName}
Categoría: ${input.category}
Ubicación: ${input.location}
Sitio Web: ${input.websiteUrl ?? "N/A"}
${input.additionalInfo ? `Información Adicional: ${input.additionalInfo}` : ""}

Calcula el "Opportunity Score" (0-100) considerando específicamente:
1. Reputación y número de reseñas
2. Presencia web y uso de redes sociales
3. Calidad del negocio (horarios, status)
4. Dolores encontrados (ej. falta de sitio web, malas reseñas)
5. Oportunidades comerciales
6. Potencial de automatización y potencial de ventas

Requisitos del formato de salida (DEBE SER JSON VÁLIDO CON LAS MISMAS LLAVES EN INGLÉS, PERO EL TEXTO EN ESPAÑOL):
{
  "qualityScore": number, // 0 a 100 basado en los criterios anteriores
  "scoreRationale": {
    "summary": "string" // Máximo 3 oraciones de resumen ejecutivo explicando el puntaje y contexto del negocio (EN ESPAÑOL)
  },
  "signals": {
    "strengths": ["string"], // Lista de fortalezas clave (EN ESPAÑOL)
    "weaknesses": ["string"] // Lista de problemas principales o puntos de dolor (EN ESPAÑOL)
  },
  "opportunities": [
    {
      "type": "string", // Tipo corto, ej. "website_redesign", "seo_optimization"
      "description": "string" // Por qué necesitan esta solución (EN ESPAÑOL)
    }
  ]
}`,
  };
};
