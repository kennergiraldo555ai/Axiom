import type { AIProviderId } from "./types";

/**
 * Returns the AI model to use for a given provider.
 *
 * Resolution order: provider-specific env var, then hardened fallback.
 * Never hardcode model names in business logic.
 * To change the model: edit .env.local only.
 *
 * Example .env.local:
 *   AI_PROVIDER=gemini
 *   GEMINI_MODEL=gemini-2.5-flash
 *   ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
 *   OPENAI_MODEL=gpt-4o
 */
export function resolveAIModel(provider: AIProviderId): string {
  switch (provider) {
    case "gemini":
      return process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
    case "anthropic":
      return process.env.ANTHROPIC_MODEL ?? "claude-3-5-sonnet-20241022";
    case "openai":
      return process.env.OPENAI_MODEL ?? "gpt-4o";
    case "mock":
      return "mock-model";
    default:
      return process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
  }
}

/**
 * Returns the active AI provider from env, defaulting to gemini.
 */
export function resolveAIProvider(): AIProviderId {
  const raw = process.env.AI_PROVIDER;
  const valid: AIProviderId[] = ["gemini", "anthropic", "openai", "mock"];
  if (raw && valid.includes(raw as AIProviderId)) {
    return raw as AIProviderId;
  }
  return "gemini";
}
