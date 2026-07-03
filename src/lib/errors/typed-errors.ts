/**
 * Typed error hierarchy for AXIOM.
 * Spec §9.2 rule 12: every error is typed. No `throw new Error("foo")`.
 * Spec §10.1: use AppError subclasses.
 *
 * Usage:
 *   throw new NotFoundError("Prospect not found");
 *   throw new ValidationError("Invalid input", { field: "city" });
 *
 *   // In Server Actions:
 *   if (error instanceof NotFoundError) { ... }
 *   // Or switch on error.code for stable programmatic handling
 */

export type ErrorCode =
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "CONFLICT"
  | "INTERNAL_ERROR"
  | "EXTERNAL_API_ERROR"
  | "AI_ERROR"
  | "RATE_LIMITED"
  | "TIMEOUT";

export interface AppErrorContext {
  /** HTTP-like status code for API boundary mapping */
  statusCode: number;
  /** Stable machine-readable code — UI can switch on this */
  code: ErrorCode;
  /** Optional structured metadata for debugging */
  metadata?: Record<string, unknown>;
}

/**
 * Base error class. All AXIOM errors extend this.
 * Never instantiate directly — use a subclass.
 */
export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly metadata?: Record<string, unknown>;

  constructor(message: string, context: AppErrorContext) {
    super(message);
    this.name = this.constructor.name;
    this.code = context.code;
    this.statusCode = context.statusCode;
    this.metadata = context.metadata;

    // Maintains proper stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, { code: "NOT_FOUND", statusCode: 404, metadata });
  }
}

export class ValidationError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, { code: "VALIDATION_ERROR", statusCode: 400, metadata });
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", metadata?: Record<string, unknown>) {
    super(message, { code: "UNAUTHORIZED", statusCode: 401, metadata });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Access denied", metadata?: Record<string, unknown>) {
    super(message, { code: "FORBIDDEN", statusCode: 403, metadata });
  }
}

export class ConflictError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, { code: "CONFLICT", statusCode: 409, metadata });
  }
}

export class InternalError extends AppError {
  constructor(message = "An unexpected error occurred", metadata?: Record<string, unknown>) {
    super(message, { code: "INTERNAL_ERROR", statusCode: 500, metadata });
  }
}

export class ExternalApiError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, { code: "EXTERNAL_API_ERROR", statusCode: 502, metadata });
  }
}

export class AiError extends AppError {
  constructor(message: string, metadata?: Record<string, unknown>) {
    super(message, { code: "AI_ERROR", statusCode: 502, metadata });
  }
}

export class RateLimitedError extends AppError {
  constructor(message = "Rate limit exceeded. Please try again later.", metadata?: Record<string, unknown>) {
    super(message, { code: "RATE_LIMITED", statusCode: 429, metadata });
  }
}

/** Type guard for AppError — use at API boundaries to decide response shape. */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
