import type { Prisma } from '@prisma/client';

/**
 * Sets the workspace_id for the current database transaction.
 * This is required for Row-Level Security (RLS) to evaluate policies correctly.
 * MUST be called inside a Prisma interactive transaction.
 *
 * @param tx - The Prisma transaction client.
 * @param workspaceId - The ID of the current workspace from the authenticated session.
 */
export async function setWorkspaceId(
  tx: Prisma.TransactionClient,
  workspaceId: string
): Promise<void> {
  // SET LOCAL scopes the variable to the current transaction only.
  // It is automatically cleared when the transaction commits or rolls back.
  await tx.$executeRaw`SET LOCAL app.workspace_id = ${workspaceId};`;
}
