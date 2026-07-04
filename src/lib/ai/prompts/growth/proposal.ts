export function evaluateProposalPrompt(params: {
  companyName: string;
  category: string;
  summary: string;
  painPoints: string[];
  opportunities: Record<string, unknown>[];
}) {
  const { companyName, category, summary, painPoints, opportunities } = params;

  return {
    systemPrompt: `Eres un consultor senior de transformación digital y un experto en ventas B2B.
Tu objetivo es escribir una propuesta comercial (cold email) corta, persuasiva, directa y altamente personalizada.
Reglas:
- NO parezcas un robot ni utilices frases corporativas genéricas ("Espero que este email te encuentre bien", "Somos líderes en el sector").
- El tono debe ser profesional pero muy directo (como Stripe, Linear, o consultoras top).
- Explica POR QUÉ recomendamos una solución. No vendas tecnología, vende resultados comerciales.
- Limita el mensaje a máximo 3-4 párrafos cortos (3 oraciones cada uno).
- Termina con un Call To Action de muy baja fricción.
- Firma genérica "[Tu Nombre] - [Tu Cargo]".
`,
    userPrompt: `Escribe un email comercial para ${companyName} (Industria: ${category}).

Contexto de la empresa:
${summary}

Debilidades/Dolores identificados:
${painPoints.map((p) => `- ${p}`).join("\n")}

Oportunidades que podemos ofrecer:
${opportunities
  .map(
    (o) =>
      `- Solución: ${o.type} | Razón (Por qué): ${
        typeof o.description === "string" ? o.description : ""
      }`
  )
  .join("\n")}

Genera únicamente el texto del email, sin introducciones adicionales ni explicaciones fuera del mensaje.`,
  };
}
