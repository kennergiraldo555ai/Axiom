import { PrismaClient } from "@prisma/client";

const getPrismaUrl = () => {
  let url = process.env.DATABASE_URL;
  // Fail-safe: Ensure we always use the connection pooler in production,
  // even if Vercel overrides DATABASE_URL to the direct IPv4 URL.
  if (url && url.includes("db.cswhbmtatwuymlvdyguh.supabase.co:5432")) {
    url = url.replace(
      "db.cswhbmtatwuymlvdyguh.supabase.co:5432",
      "aws-1-us-east-2.pooler.supabase.com:6543",
    );
    if (!url.includes("pgbouncer=true")) {
      url += (url.includes("?") ? "&" : "?") + "pgbouncer=true&connection_limit=1";
    }
  }
  return url;
};

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getPrismaUrl(),
      },
    },
  });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
