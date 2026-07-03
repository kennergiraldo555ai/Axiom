import { getSession } from "./session";
import { UnauthorizedError } from "@/lib/errors/typed-errors";

export async function requireUser() {
  const user = await getSession();
  if (!user) {
    throw new UnauthorizedError("User is not authenticated");
  }
  return user;
}

export async function requireWorkspace() {
  const user = await requireUser();
  // In the future this will fetch the active workspace from the database.
  // For the MVP, we just return a stub or we can rely on a metadata field.
  // We'll throw if no workspace is attached.

  // Example for MVP (using a dummy ID since we don't have DB yet)
  const workspaceId = "ws_stub_id";

  if (!workspaceId) {
    throw new UnauthorizedError("User does not belong to any workspace");
  }

  return { user, workspaceId };
}
