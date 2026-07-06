# Supabase Database Connection Architecture

Este documento define la arquitectura y configuración oficial para conectar AXIOM con Supabase utilizando Prisma en entornos Serverless (Vercel).

## El Problema con IPv6 y Serverless

Supabase ha migrado sus conexiones de base de datos directas (puerto 5432) a redes IPv6 de manera predeterminada para todos los proyectos (a menos que se adquiera un add-on de IPv4).
Dado que entornos serverless como **Vercel** o conexiones locales en ciertas redes no tienen soporte completo o ruteo para IPv6, los intentos de conexión directa generan bloqueos y errores como:

`Error: connect ETIMEDOUT 2600:1f16:1482:...:5432`

## Solución Definitiva: Supabase Connection Pooler (Supavisor)

Para asegurar compatibilidad con redes IPv4 y un manejo eficiente de múltiples conexiones concurrentes (necesario en serverless), **siempre** utilizaremos el Connection Pooler provisto por Supabase.

### Configuración de Prisma y Variables de Entorno

En lugar de apuntar a `db.[proyecto].supabase.co`, usaremos el dominio del pooler que provee Supabase (por ejemplo, `aws-[X]-[region].pooler.supabase.com`).

#### 1. DATABASE_URL (Transaction Pooler - Puerto 6543)

Se utiliza para todas las operaciones de la aplicación (consultas regulares). Mantiene el pooling transaccional.

Formato:

```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-[X]-[region].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

_Nota:_ El parámetro `?pgbouncer=true&connection_limit=1` es obligatorio para entornos serverless.

#### 2. DIRECT_URL (Session Pooler - Puerto 5432)

Se utiliza de forma exclusiva para realizar migraciones de esquema, introspección o comandos administrativos (`prisma migrate`, `prisma db push`, `prisma pull`). Las migraciones no pueden ejecutarse a través del Transaction Pooler.

Formato:

```
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-[X]-[region].pooler.supabase.com:5432/postgres"
```

## Resumen de Reglas

1. Nunca uses `db.[proyecto].supabase.co` en `.env` (a menos que adquieras el addon IPv4).
2. Usa el Host del Connection Pooler (Settings -> Database -> Connection Pooler).
3. Asegúrate de configurar la contraseña correcta.
4. Prisma usará automáticamente `DATABASE_URL` para su cliente y `DIRECT_URL` para migraciones, ya que `schema.prisma` está configurado con:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```
