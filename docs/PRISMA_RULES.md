# AXIOM Prisma Architecture & Best Practices

Este documento establece las reglas permanentes e inquebrantables para el uso de Prisma en el proyecto AXIOM.

## 1. Generación del Cliente (El Problema del Caché en CI/CD)

**Contexto:** Los entornos como Vercel cachean la carpeta `node_modules` para acelerar los despliegues. Dado que Prisma genera su cliente dentro de `node_modules/.prisma/client`, un cambio en `schema.prisma` NO invalida la caché de dependencias (porque `package.json` no cambia). Esto provoca que Vercel compile con un cliente Prisma obsoleto que carece de los nuevos Modelos o Enums (ej. `LeadStatus`).

**REGLA OBLIGATORIA (El Hardening):**
Nunca confíes exclusivamente en el hook `postinstall` de `package.json` para generar el cliente en producción.
✅ **HACER:** En `package.json`, el comando build siempre debe ser:

```json
"build": "prisma generate && next build"
```

❌ **NUNCA HACER:** Dejar el comando build simplemente como `"next build"` asumiendo que el `postinstall` siempre se ejecutará de forma fiable.

## 2. Tipado Estricto de Enums y Modelos

**Contexto:** Prisma exporta sus tipos desde `@prisma/client`.
✅ **HACER:** Siempre importa los tipos explícitamente desde `@prisma/client` utilizando la directiva `type` (o dejando que Next.js/Babel lo infiera) y nunca redelcares manualmente los enums en archivos locales.

```typescript
import type { Lead, LeadStatus } from "@prisma/client";
```

❌ **NUNCA HACER:** Crear copias manuales de tipos o enums de Prisma. Si el schema cambia, TypeScript debe explotar y fallar localmente.

## 3. Manejo de Migraciones

✅ **HACER:** En entornos de producción, la migración de la base de datos debe ejecutarse de forma segura. En Supabase/Vercel sin soporte para pooling agresivo en migraciones, usar `npx prisma migrate deploy` si la base de datos no está sincronizada, o usar Serverless push si aplica.
❌ **NUNCA HACER:** Modificar manualmente la base de datos en producción por fuera del flujo de Prisma.

## 4. Resolución de Prisma y PNPM en Vercel (Symlinks)

**Contexto:** PNPM usa enlaces simbólicos (symlinks) alojados en `.pnpm`. Si se fuerza una ruta absoluta/relativa estática en el generador de Prisma, Vercel compilará pero el cliente de Prisma generado no se inyectará en la ruta de resolución virtual de PNPM que Next.js utiliza.

**REGLA OBLIGATORIA:**
✅ **HACER:** Dejar que Prisma decida la ruta de salida por defecto en `schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
  // NO AGREGAR LA PROPIEDAD 'output' AQUÍ
}
```

❌ **NUNCA HACER:** Configurar `output = "../node_modules/.prisma/client"`. Esto genera el cliente en el root real, pero TypeScript/Next.js buscará los tipos dentro del virtual store de `.pnpm`, resultando en el temido error "Module '@prisma/client' has no exported member...".

## 5. Pruebas de Desarrollo

✅ **HACER:** Ante cualquier error de "Module '@prisma/client' has no exported member", el desarrollador está OBLIGADO a ejecutar un Clean Build local, simulando el entorno CI/CD.

1. `rm -rf node_modules/.prisma`
2. `rm -rf .next`
3. `pnpm install`
4. `pnpm exec prisma generate`
5. `pnpm build`
