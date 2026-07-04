import type { Prisma } from "@prisma/client";
import { prisma } from "./client";
import { setWorkspaceId } from "./rls";

/**
 * Wraps a block of database operations in an interactive transaction.
 * Optionally sets the workspace_id for Row-Level Security (RLS).
 *
 * @param callback - The operations to perform inside the transaction.
 * @param workspaceId - The workspace ID to scope the transaction to (optional but recommended).
 * @param options - Transaction options (timeout, maxWait).
 * @returns The result of the callback.
 */
export async function withTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>,
  workspaceId?: string,
  options?: { maxWait?: number; timeout?: number },
): Promise<T> {
  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    if (workspaceId) {
      await setWorkspaceId(tx, workspaceId);
    }
    return await callback(tx);
  }, options);
}
