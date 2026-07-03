/**
 * Retry helper with exponential backoff.
 * Used for external API calls (Places, AI) that may transiently fail.
 * Spec §9.2: "No silent failures."
 */

export interface RetryOptions {
  /** Maximum number of attempts (default: 3) */
  maxAttempts?: number;
  /** Base delay in milliseconds (default: 100ms) */
  baseDelayMs?: number;
  /** Maximum delay cap in milliseconds (default: 5000ms) */
  maxDelayMs?: number;
  /** Optional predicate — return false to stop retrying on specific errors */
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, "shouldRetry">> = {
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 5000,
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(attempt: number, baseMs: number, maxMs: number): number {
  // Exponential backoff with jitter: base * 2^attempt + random(0, base)
  const exponential = baseMs * Math.pow(2, attempt);
  const jitter = Math.random() * baseMs;
  return Math.min(exponential + jitter, maxMs);
}

/**
 * Retries an async function with exponential backoff.
 *
 * @throws The last error if all attempts fail.
 */
export async function retry<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === opts.maxAttempts - 1;
      const shouldStop = opts.shouldRetry ? !opts.shouldRetry(error, attempt) : false;

      if (isLastAttempt || shouldStop) break;

      const backoffMs = calculateBackoff(attempt, opts.baseDelayMs, opts.maxDelayMs);
      await delay(backoffMs);
    }
  }

  throw lastError;
}
