# Auth Architecture

## Supabase Auth + Prisma

1. Supabase maneja las sesiones, JWTs y callbacks.
2. Prisma maneja la tabla de Usuarios (`User`) con un `authId` que referencia el UUID de Supabase.

## Auto Provisioning

En la ruta `callback/route.ts`, sincronizamos el usuario síncronamente y creamos su Workspace inicial si no existe.
