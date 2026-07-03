# AXIOM Build Log

Este documento registra la evoluci√≥n t√©cnica del proyecto.

Nunca debe eliminarse informaci√≥n.

Cada Sprint debe a√±adir una nueva entrada.

---

# Sprint 0.1

**Estado:** Completado

## Objetivo

Inicializar la base t√©cnica del proyecto.

### Alcance

- Configurar Next.js
- Configurar TypeScript
- Configurar Tailwind CSS
- Configurar shadcn/ui
- Configurar pnpm
- Configurar Supabase
- Crear estructura inicial del proyecto
- Confirmar que la aplicaci√≥n ejecuta correctamente

### Fuera del alcance

- Autenticaci√≥n
- CRM
- IA
- Prospecting
- Base de datos funcional
- Componentes de negocio
- Automatizaciones

### Resultado

Completado. Base t√©cnica inicializada con √©xito y validada con todos los comandos de compilaci√≥n y verificaci√≥n (`build`, `dev`, `lint`, `typecheck`). La arquitectura fundacional del proyecto ya est√° desplegada.

### Decisiones t√©cnicas

- **TS exactOptionalPropertyTypes:** Se adaptaron constructores en `typed-errors.ts` para no asignar expl√≠citamente `undefined`, preservando la regla estricta.
- **ESLint 9 Flat Config:** Se configur√≥ ESLint para usar arreglos de configuraci√≥n planos nativos de `eslint-config-next`, evadiendo la necesidad de compatibilidad h√≠brida y mejorando los tiempos de linting, reduciendo errores de validaci√≥n JSON circular.
- **Next.js typedRoutes:** Se actualiz√≥ `next.config.ts` y se solucionaron errores en rutas din√°micas.

### Problemas encontrados

- Mismatch entre `eslint-config-next` y ESLint 9 (resuelto al usar las exportaciones de sub-m√≥dulos).
- Incompatibilidades menores de rutas din√°micas contra `typedRoutes` (resuelto).
- Advertencias de Tailwind y CSS `@import` (resuelto reordenando dependencias en `globals.css`).

---

# Sprint 0.2

**Estado:** Completado

## Objetivo

Implementar la infraestructura base (Core Infrastructure) requerida por el AXIOM Master Spec (Fase 0).

### Alcance

- Configuraci√≥n del cliente Supabase SSR (Servidor y Navegador).
- Infraestructura de Autenticaci√≥n (Middleware, Guards `requireUser`).
- Layout p√∫blico (`/(auth)/layout.tsx`) y layout protegido (`/(app)/layout.tsx`).
- P√°gina de login (Stub Auth UI) y manejador de callbacks.
- Proveedores globales (`ThemeProvider`, `QueryClientProvider`, `Toaster`).
- Manejadores globales de errores (`error.tsx`, `not-found.tsx`, `loading.tsx`).
- Configuraci√≥n de estado global con Zustand (`use-app-store.ts`).
- Utilidades compartidas (`cn` para Tailwind).
- Preparaci√≥n del archivo `.env.example` y variables de entorno ficticias.

### Fuera del alcance

- Modelado o ejecuci√≥n de migraciones de base de datos reales.
- Integraci√≥n real con el proyecto de Supabase externo (solo stub via env vars).
- L√≥gica de negocio (CRM, IA, Prospecting).
- UI premium/detallada para la autenticaci√≥n (se prioriz√≥ correcci√≥n t√©cnica).
- Consultas reales con TanStack Query (solo se implement√≥ el Provider).

### Resultado

Completado. Se instalaron dependencias cr√≠ticas (`@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `zustand`, `@tanstack/react-query`, `sonner`, `next-themes`).
El proyecto compila exitosamente (`pnpm build`) pasando `typecheck` y `lint`.
Se configuraron las guardas de autenticaci√≥n con redirecci√≥n v√≠a middleware Next.js.
Variables de entorno est√°n seguras mediante `zod` (`src/lib/config/env.ts`).

### Decisiones t√©cnicas

- **Supabase SSR:** Se implement√≥ el flujo de Magic Link Auth mediante SSR utilizando middleware para actualizar y refrescar sesiones de forma transparente.
- **Providers:** Se agruparon en `AppProviders` (`src/lib/providers/app-providers.tsx`) para inyectarlos en el Root Layout limpiamente.
- **Theme Provider:** Se forz√≥ el `defaultTheme="dark"` con `enableSystem={false}` para cumplir estrictamente con la especificaci√≥n (Dark mode por defecto y sin light mode en MVP).
- **Zustand:** Se implement√≥ `useAppStore` para el manejo base del estado global cliente, preparado para coordinar el sidebar y otras interacciones visuales simples.

### Problemas encontrados

- **Manejo del Request Cookies en Next.js Middleware:** La API de Supabase `setAll` requer√≠a adaptaci√≥n a la nueva firma de `request.cookies.set()` que no acepta el par√°metro `options` en la misma posici√≥n, resuelto omitiendo iterar opciones que no soporta.
- **Build con validaci√≥n Zod Env:** Next.js turbopack intent√≥ evaluar `env.ts` para capturar la data est√°tica, fallando por falta de secretos. Resuelto creando archivo `.env.local` y `.env.example` con stubs que superan validaci√≥n URL.

### Pr√≥ximos pasos

Iniciar Sprint 0.3.

---

# Sprint 0.3

**Estado:** Completado (A la espera de credenciales para migraciones)

## Objetivo

Finalizar la configuraciÛn de la infraestructura base (Fase 0), integrando Prisma (Base de Datos) y la observabilidad (Pino Logger, Sentry), adem·s de preparar el despliegue a Vercel.

### Alcance

- IntegraciÛn de Prisma Client Singleton en \src/lib/db/client.ts\.
- ImplementaciÛn de helpers de transacciones (\withTransaction\) y seguridad RLS (\setWorkspaceId\).
- IntegraciÛn de Sentry de forma 100% manual (\sentry.client.config.ts\, \sentry.server.config.ts\, \sentry.edge.config.ts\, \instrumentation.ts\, \
ext.config.ts\).
- ConfiguraciÛn de Pino Logger estructurado.
- Middleware para inyectar \x-request-id\ en cada peticiÛn.
- CorrecciÛn de sintaxis de relaciones Prisma en \schema.prisma\.

### Fuera del alcance

- ConexiÛn a bases de datos de desarrollo temporal o local.
- LÛgica de negocio de la Fase 1.
- Ejecutar migraciones automatizadas sin autorizaciÛn explÌcita y credenciales de producciÛn.

### Resultado

Completado a nivel de cÛdigo. La infraestructura se encuentra lista. Se validaron los tipos, linter y build general satisfactoriamente (\pnpm build\, \pnpm lint\, \pnpm typecheck\). Prisma generÛ su cliente local sin problemas (\
px prisma generate\).

### Decisiones tÈcnicas

- **Prisma v6:** Se optÛ por Prisma 6 en lugar de Prisma 7 para evitar incompatibilidades de configuraciÛn no documentadas o inestables con el esquema pre-existente, preservando la compatibilidad de \url\ y \directUrl\ sin requerir configuraciones de adaptadores complejas.
- **Sentry Manual:** Se implementÛ manualmente y de forma limpia en lugar de utilizar el \@sentry/wizard\, evitando cÛdigo generado residual.
- **Relaciones Prisma:** Se corrigiÛ un error de ambig¸edad en \schema.prisma\ donde las relaciones 1-a-1 entre \Prospect\ y \Lead\ colisionaban. Se resolvieron agregando nombres explÌcitos y especificando el constraint \@unique\ correcto en el modelo \Lead\.

### Problemas encontrados

- **Build ignorados en pnpm:** pnpm bloqueÛ la generaciÛn del Prisma Client (\@prisma/client\) por restricciones de ejecuciÛn de scripts postinstall. Se resolviÛ registrando los paquetes explÌcitamente en el nodo \pnpm.approvedBuilds\ de \package.json\.


---

# Sprint 0.4

**Estado:** Completado (Cierre de Phase 0)

## Objetivo

AuditorÌa tÈcnica general y preparaciÛn final de la infraestructura para dar paso a la Phase 1. No se implementaron nuevas funcionalidades, sino que se estabilizÛ la base actual.

### Alcance

- AuditorÌa de dependencias, seguridad, estructura de archivos y consistencia del cÛdigo.
- RevisiÛn de la configuraciÛn para despliegue en Vercel (Supabase, Sentry, Prisma).
- VerificaciÛn final exhaustiva (\lint\, \	ypecheck\, \uild\).
- ElaboraciÛn de propuesta tÈcnica (plan de implementaciÛn) para la Phase 1 enfocada en AXIOM Growth (mÛdulo de prospecciÛn y generaciÛn de ingresos).

### Resultado

Completado. La base de cÛdigo de la Phase 0 (Foundation) se encuentra 100% estable y lista para escalar. No hay advertencias de linter, y los tipos de TypeScript est·n completamente alineados. 

### Decisiones tÈcnicas

- **Mantenimiento de Dependencias:** Se decidiÛ NO actualizar Prisma a 7.x ni React a 19.2.7 para preservar la estabilidad obtenida con Prisma 6.19.3, evitando la introducciÛn de bugs relacionados a configuraciones de adaptadores y conexiones directas de DB en la capa SSR.
- **PreparaciÛn Vercel/Supabase:** La integraciÛn quedÛ condicionada a la inyecciÛn final de variables de entorno en Vercel por parte del usuario, manteniendo la seguridad de las credenciales fuera del repositorio.

