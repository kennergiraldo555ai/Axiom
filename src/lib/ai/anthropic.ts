import Anthropic from "@anthropic-ai/sdk";
import type { AIRequest, AIResponse, IAIProviderAdapter, AIProviderId } from "./types";

export class AnthropicAdapter implements IAIProviderAdapter {
  id: AIProviderId = "anthropic";
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });
  }

  async complete(request: AIRequest): Promise<AIResponse> {
    const startTime = performance.now();

    const response = await this.client.messages.create({
      model: request.model,
      ...(request.systemPrompt ? { system: request.systemPrompt } : {}),
      messages: [{ role: "user", content: request.userPrompt }],
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.7,
    });

    const durationMs = Math.round(performance.now() - startTime);

    const inputTokens = response.usage?.input_tokens ?? 0;
    const outputTokens = response.usage?.output_tokens ?? 0;

    // Estimación básica de costos (Sonnet 3.5 = $3/$15, Haiku = $0.25/$1.25)
    let costUsd = 0;
    if (request.model.includes("sonnet")) {
      costUsd = (inputTokens / 1_000_000) * 3 + (outputTokens / 1_000_000) * 15;
    } else if (request.model.includes("haiku")) {
      costUsd = (inputTokens / 1_000_000) * 0.25 + (outputTokens / 1_000_000) * 1.25;
    }

    const textContent = response.content[0];

    return {
      text: textContent?.type === "text" ? textContent.text : "",
      usage: {
        inputTokens,
        outputTokens,
        costUsd,
      },
      durationMs,
      provider: this.id,
      model: request.model,
    };
  }
}
