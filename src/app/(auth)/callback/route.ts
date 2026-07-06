import { NextResponse } from "next/server";
import { createClient } from "@/lib/auth/supabase/server";
import { prisma } from "@/lib/db/client";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      // Auto-Provisioning: Check if the user exists in Prisma
      const existingUser = await prisma.user.findUnique({
        where: { authId: session.user.id },
      });

      if (!existingUser) {
        // Run everything in a transaction to ensure atomic provisioning
        await prisma.$transaction(async (tx) => {
          // 1. Create Workspace
          const workspace = await tx.workspace.create({
            data: {
              name: `Espacio de ${session.user.user_metadata?.full_name || session.user.email?.split("@")[0] || "Trabajo"}`,
              slug: `ws-${Date.now().toString(36)}`, // generate unique slug
              plan: "FREE",
            },
          });

          // 2. Create User
          const user = await tx.user.create({
            data: {
              authId: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata?.full_name,
              avatarUrl: session.user.user_metadata?.avatar_url,
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

          // 4. Initial Configs (Growth, CRM, AI, Automation) - To be implemented in future Sprints
          // Right now, just having the workspace and membership is enough for the MVP schema,
          // but we leave this comment to indicate where default config tables would be initialized.
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to the login page with a descriptive error
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
