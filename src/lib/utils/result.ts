/**
 * Result<T, E> — typed error handling without exceptions in business logic.
 * Spec §10.1: Use Result<T, E> for fallible operations.
 *
 * Usage:
 *   function findUser(id: string): Result<User, AppError> {
 *     if (!id) return err(new NotFoundError("User not found"));
 *     return ok({ id, name: "..." });
 *   }
 *
 *   const result = findUser("123");
 *   if (result.ok) { result.value } else { result.error }
 */

export type Result<T, E = Error> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

/** Wrap a successful value in a Result. */
export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/** Wrap an error in a Result. */
export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

/**
 * Unwraps a Result or throws the error.
 * Use only at application boundaries (e.g., Server Actions presenting to UI).
 */
export function unwrap<T, E extends Error>(result: Result<T, E>): T {
  if (result.ok) return result.value;
  throw result.error;
}

/**
 * Maps the value of a successful Result.
 * Returns the error unchanged if the Result is an error.
 */
export function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  if (result.ok) return ok(fn(result.value));
  return result;
}

/**
 * Maps the error of a failed Result.
 * Returns the value unchanged if the Result is successful.
 */
export function mapErr<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
  if (!result.ok) return err(fn(result.error));
  return result;
}
