import { getSession } from "./session";
import { prisma } from "@/lib/db/client";
import { UnauthorizedError } from "@/lib/errors/typed-errors";
import { logger } from "@/lib/observability/logger";
import type { User, Workspace, Membership } from "@prisma/client";

/**
 * WorkspaceContextService
 * Centralized service to manage authentication and workspace context.
 * This is the ONLY authorized way to get workspaceId across the application.
 *
 * Auto-provisioning: If the Supabase Auth user has no Prisma record,
 * we atomically create User + Workspace + Membership on the fly.
 */
export class WorkspaceContextService {
  /**
   * Gets the current authenticated Prisma User.
   * If the user doesn't exist in Prisma yet, auto-provisions them.
   */
  static async getCurrentUser(): Promise<User | null> {
    const sessionUser = await getSession();
    if (!sessionUser) return null;

    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { authId: sessionUser.id },
    });

    // Auto-provision if no Prisma record exists
    if (!user) {
      user = await this.ensureProvisioned(sessionUser);
    }

    return user;
  }

  /**
   * Auto-provisions a Supabase Auth user into the AXIOM system.
   * Creates User + Workspace + Membership atomically.
   * This is a transparent safety net — the user never sees any error.
   */
  private static async ensureProvisioned(sessionUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }): Promise<User> {
    logger.info(
      { authId: sessionUser.id, email: sessionUser.email },
      "Auto-provisioning new user (no Prisma record found)",
    );

    const result = await prisma.$transaction(async (tx) => {
      // Double-check inside transaction to prevent race conditions
      const existingUser = await tx.user.findUnique({
        where: { authId: sessionUser.id },
      });

      if (existingUser) {
        return existingUser;
      }

      // 1. Create Workspace
      const displayName =
        (sessionUser.user_metadata?.full_name as string) ||
        sessionUser.email?.split("@")[0] ||
        "Trabajo";

      const workspace = await tx.workspace.create({
        data: {
          name: `Espacio de ${displayName}`,
          slug: `ws-${Date.now().toString(36)}`,
          plan: "FREE",
        },
      });

      // 2. Create User
      const user = await tx.user.create({
        data: {
          authId: sessionUser.id,
          email: sessionUser.email ?? `${sessionUser.id}@unknown.local`,
          name: (sessionUser.user_metadata?.full_name as string) || null,
          avatarUrl: (sessionUser.user_metadata?.avatar_url as string) || null,
        },
      });

      // 3. Create Membership (Owner)
      await tx.membership.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: "OWNER",
        },
      });

      logger.info(
        { userId: user.id, workspaceId: workspace.id },
        "Auto-provisioning completed successfully",
      );

      return user;
    });

    return result;
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
