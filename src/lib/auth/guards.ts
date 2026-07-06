import { getSession } from "./session";
import { UnauthorizedError } from "@/lib/errors/typed-errors";
import { WorkspaceContextService } from "./workspace-context";

export async function requireUser() {
  const user = await getSession();
  if (!user) {
    throw new UnauthorizedError("User is not authenticated");
  }
  return user;
}

export async function requireWorkspace() {
  await requireUser(); // Ensure valid Supabase session first
  return WorkspaceContextService.requireWorkspace();
}
