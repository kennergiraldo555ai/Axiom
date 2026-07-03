export type AIProviderId = "anthropic" | "openai" | "gemini" | "mock";

export interface AIRequest {
  provider: AIProviderId;
  model: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
  requestId?: string; // Para trazabilidad
}

export interface AIResponse {
  text: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    costUsd?: number;
  };
  durationMs: number;
  provider: AIProviderId;
  model: string;
}

export interface IAIProviderAdapter {
  id: AIProviderId;
  complete(request: AIRequest): Promise<AIResponse>;
}
