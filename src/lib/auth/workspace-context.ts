import { getSession } from "./session";
import { prisma } from "@/lib/db/client";
import { UnauthorizedError } from "@/lib/errors/typed-errors";
import type { User, Workspace, Membership } from "@prisma/client";

/**
 * WorkspaceContextService
 * Centralized service to manage authentication and workspace context.
 * This is the ONLY authorized way to get workspaceId across the application.
 */
export class WorkspaceContextService {
  /**
   * Gets the current authenticated Prisma User.
   */
  static async getCurrentUser(): Promise<User | null> {
    const sessionUser = await getSession();
    if (!sessionUser) return null;

    return prisma.user.findUnique({
      where: { authId: sessionUser.id },
    });
  }

  /**
   * Gets the active membership for the current user.
   * For the MVP, it returns the first membership found.
   */
  static async getCurrentMembership(): Promise<(Membership & { workspace: Workspace }) | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id },
      include: { workspace: true },
      orderBy: { joinedAt: "asc" },
    });

    return membership;
  }

  /**
   * Gets the active workspace for the current user.
   */
  static async getCurrentWorkspace(): Promise<Workspace | null> {
    const membership = await this.getCurrentMembership();
    return membership?.workspace || null;
  }

  /**
   * Requires a valid workspace context. Throws if unauthorized or no workspace.
   * Returns the user, workspaceId, and membership role.
   */
  static async requireWorkspace() {
    const membership = await this.getCurrentMembership();
    if (!membership) {
      throw new UnauthorizedError("User does not belong to any workspace");
    }

    return {
      user: membership.userId,
      workspaceId: membership.workspaceId,
      role: membership.role,
    };
  }

  /**
   * Requires the user to be an OWNER of the current workspace.
   */
  static async requireOwner() {
    const context = await this.requireWorkspace();
    if (context.role !== "OWNER") {
      throw new UnauthorizedError("This action requires OWNER privileges");
    }
    return context;
  }

  /**
   * Requires the user to be at least an ADMIN of the current workspace.
   */
  static async requireAdmin() {
    const context = await this.requireWorkspace();
    if (context.role !== "OWNER" && context.role !== "ADMIN") {
      throw new UnauthorizedError("This action requires ADMIN privileges");
    }
    return context;
  }

  /**
   * Checks if the user has a specific role (for future permission checking).
   */
  static async can(permissionRole: "OWNER" | "ADMIN" | "MEMBER"): Promise<boolean> {
    try {
      const membership = await this.getCurrentMembership();
      if (!membership) return false;

      const roleWeights = { MEMBER: 1, ADMIN: 2, OWNER: 3 };
      return roleWeights[membership.role] >= roleWeights[permissionRole];
    } catch {
      return false;
    }
  }
}
