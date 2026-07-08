/**
 * Script de prueba aislado para Gemini.
 * NO usa Router, NO usa UseCases, NO usa Prospecting.
 *
 * Uso (desde la raiz del proyecto):
 *   node --env-file=.env --env-file=.env.local scripts/test-gemini.mjs
 *
 * Requiere Node >= 20.6 (soporta --env-file nativo).
 */

import { GoogleGenAI } from "@google/genai";

// 1. Leer variables de entorno (cargadas por --env-file)
const apiKey = process.env.GEMINI_API_KEY;
const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

console.log("=== Gemini Isolated Test ===");
console.log(`Model:   ${model}`);
console.log(`API Key: ${apiKey ? `${apiKey.substring(0, 8)}...` : "NOT SET"}`);
console.log("");

if (!apiKey || apiKey === "INSERT_YOUR_GEMINI_KEY") {
  console.error("ERROR: GEMINI_API_KEY no esta configurada en .env.local");
  process.exit(1);
}

// 2. Inicializar Gemini con @google/genai SDK
const ai = new GoogleGenAI({ apiKey });

// 3. Enviar solicitud simple aislada
async function run() {
  try {
    console.log("Enviando solicitud a Gemini...");
    const response = await ai.models.generateContent({
      model,
      contents: "Haz un resumen en una frase: el proposito de AXIOM es ayudar a vender mas usando IA.",
    });

    console.log("");
    console.log("Respuesta de Gemini:");
    console.log(response.text);
    console.log("");
    console.log("=== TEST EXITOSO ===");
  } catch (err) {
    console.error("ERROR al llamar a Gemini:");
    console.error(err.message ?? String(err));
    process.exit(1);
  }
}

run();
