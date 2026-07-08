import { logger } from "@/lib/observability/logger";
import type { AIRequest, AIResponse, IAIProviderAdapter } from "./types";
import { AnthropicAdapter } from "./anthropic";
import { GeminiAdapter } from "./gemini";

class AIRouter {
  private adapters: Map<string, IAIProviderAdapter> = new Map();

  constructor() {
    // Registramos los adaptadores disponibles
    this.adapters.set("anthropic", new AnthropicAdapter());
    this.adapters.set("gemini", new GeminiAdapter());
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const adapter = this.adapters.get(request.provider);

    if (!adapter) {
      const err = new Error(`AI Provider ${request.provider} no está implementado`);
      logger.error({ error: err.message, provider: request.provider }, "AI Provider not found");
      throw err;
    }

    try {
      const response = await adapter.complete(request);

      // Observabilidad: Logueamos la traza completa de la llamada exitosa
      logger.info(
        {
          aiProvider: response.provider,
          aiModel: response.model,
          aiRequestId: request.requestId,
          aiDurationMs: response.durationMs,
          aiInputTokens: response.usage.inputTokens,
          aiOutputTokens: response.usage.outputTokens,
          aiCostUsd: response.usage.costUsd,
        },
        "AI Request completada exitosamente",
      );

      return response;
    } catch (error: unknown) {
      const err = error as Error;
      // Observabilidad: Logueamos el error
      logger.error(
        {
          aiProvider: request.provider,
          aiModel: request.model,
          aiRequestId: request.requestId,
          error: err.message || err.toString(),
        },
        "AI Request fallida",
      );

      throw error;
    }
  }
}

export const aiRouter = new AIRouter();
