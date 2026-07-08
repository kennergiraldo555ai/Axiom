import { GoogleGenAI } from "@google/genai";
import type { AIRequest, AIResponse, IAIProviderAdapter, AIProviderId } from "./types";
import { logger } from "@/lib/observability/logger";

export class GeminiAdapter implements IAIProviderAdapter {
  id: AIProviderId = "gemini";
  private client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
    });
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();

    try {
      const response = await this.client.models.generateContent({
        model: request.model,
        contents: request.userPrompt,
        config: {
          ...(request.systemPrompt ? { systemInstruction: request.systemPrompt } : {}),
          maxOutputTokens: request.maxTokens ?? 4096,
          temperature: request.temperature ?? 0.7,
        },
      });

      const durationMs = Math.round(performance.now() - startTime);

      const inputTokens = response.usageMetadata?.promptTokenCount ?? 0;
      const outputTokens = response.usageMetadata?.candidatesTokenCount ?? 0;

      // Estimación básica de costos Gemini 1.5 Flash y Pro
      let costUsd = 0;
      if (request.model.includes("pro")) {
        costUsd = (inputTokens / 1_000_000) * 1.25 + (outputTokens / 1_000_000) * 5.0;
      } else if (request.model.includes("flash")) {
        costUsd = (inputTokens / 1_000_000) * 0.075 + (outputTokens / 1_000_000) * 0.3;
      }

      return {
        text: response.text ?? "",
        usage: {
          inputTokens,
          outputTokens,
          costUsd,
        },
        durationMs,
        provider: this.id,
        model: request.model,
      };
    } catch (error) {
      logger.error({ error, model: request.model }, "Gemini API error");
      throw error;
    }
  }
}
