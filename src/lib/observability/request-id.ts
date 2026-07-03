import { headers } from 'next/headers';

/**
 * Retrieves the request ID from the current request headers.
 * The request ID is injected by the middleware (x-request-id).
 * This must be called inside a Server Component or Server Action.
 * 
 * @returns The request ID or 'unknown' if not available.
 */
export async function getRequestId(): Promise<string> {
  try {
    const headersList = await headers();
    return headersList.get('x-request-id') || 'unknown';
  } catch {
    // If called outside of a request context (e.g. background job), return unknown
    return 'unknown';
  }
}
