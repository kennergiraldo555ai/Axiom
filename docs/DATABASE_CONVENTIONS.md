# Database Conventions

1. Todos los IDs primarios son ULID generados con `gen_random_ulid()` (varchar 26).
2. Los nombres de las tablas y columnas en BD son `snake_case`.
3. El esquema en Prisma usa `camelCase`.
4. Nunca eliminar registros físicamente, usar `deletedAt` para Soft Deletes.
