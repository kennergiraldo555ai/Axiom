# Supabase Guidelines

1. Usa `@supabase/ssr` para Server Components y Server Actions.
2. NUNCA accedas a la base de datos de Prisma en el frontend (Client Components).
3. Usa RLS (Row Level Security) solo para protección en capa de base de datos extra, pero asume que la lógica de aplicación (DDD) maneja la validación de pertenencia al Workspace.
