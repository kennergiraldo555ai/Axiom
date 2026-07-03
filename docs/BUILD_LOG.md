# AXIOM Build Log

Este documento registra la evolución técnica del proyecto.

Nunca debe eliminarse información.

Cada Sprint debe añadir una nueva entrada.

---

# Sprint 0.1

**Estado:** Completado

## Objetivo

Inicializar la base técnica del proyecto.

### Alcance

- Configurar Next.js
- Configurar TypeScript
- Configurar Tailwind CSS
- Configurar shadcn/ui
- Configurar pnpm
- Configurar Supabase
- Crear estructura inicial del proyecto
- Confirmar que la aplicación ejecuta correctamente

### Fuera del alcance

- Autenticación
- CRM
- IA
- Prospecting
- Base de datos funcional
- Componentes de negocio
- Automatizaciones

### Resultado

Completado. Base técnica inicializada con éxito y validada con todos los comandos de compilación y verificación (`build`, `dev`, `lint`, `typecheck`). La arquitectura fundacional del proyecto ya está desplegada.

### Decisiones técnicas

- **TS exactOptionalPropertyTypes:** Se adaptaron constructores en `typed-errors.ts` para no asignar explícitamente `undefined`, preservando la regla estricta.
- **ESLint 9 Flat Config:** Se configuró ESLint para usar arreglos de configuración planos nativos de `eslint-config-next`, evadiendo la necesidad de compatibilidad híbrida y mejorando los tiempos de linting, reduciendo errores de validación JSON circular.
- **Next.js typedRoutes:** Se actualizó `next.config.ts` y se solucionaron errores en rutas dinámicas.

### Problemas encontrados

- Mismatch entre `eslint-config-next` y ESLint 9 (resuelto al usar las exportaciones de sub-módulos).
- Incompatibilidades menores de rutas dinámicas contra `typedRoutes` (resuelto).
- Advertencias de Tailwind y CSS `@import` (resuelto reordenando dependencias en `globals.css`).

---

# Sprint 0.2

**Estado:** Completado

## Objetivo

Implementar la infraestructura base (Core Infrastructure) requerida por el AXIOM Master Spec (Fase 0).

### Alcance

- Configuración del cliente Supabase SSR (Servidor y Navegador).
- Infraestructura de Autenticación (Middleware, Guards `requireUser`).
- Layout público (`/(auth)/layout.tsx`) y layout protegido (`/(app)/layout.tsx`).
- Página de login (Stub Auth UI) y manejador de callbacks.
- Proveedores globales (`ThemeProvider`, `QueryClientProvider`, `Toaster`).
- Manejadores globales de errores (`error.tsx`, `not-found.tsx`, `loading.tsx`).
- Configuración de estado global con Zustand (`use-app-store.ts`).
- Utilidades compartidas (`cn` para Tailwind).
- Preparación del archivo `.env.example` y variables de entorno ficticias.

### Fuera del alcance

- Modelado o ejecución de migraciones de base de datos reales.
- Integración real con el proyecto de Supabase externo (solo stub via env vars).
- Lógica de negocio (CRM, IA, Prospecting).
- UI premium/detallada para la autenticación (se priorizó corrección técnica).
- Consultas reales con TanStack Query (solo se implementó el Provider).

### Resultado

Completado. Se instalaron dependencias críticas (`@supabase/supabase-js`, `@supabase/ssr`, `lucide-react`, `zustand`, `@tanstack/react-query`, `sonner`, `next-themes`).
El proyecto compila exitosamente (`pnpm build`) pasando `typecheck` y `lint`.
Se configuraron las guardas de autenticación con redirección vía middleware Next.js.
Variables de entorno están seguras mediante `zod` (`src/lib/config/env.ts`).

### Decisiones técnicas

- **Supabase SSR:** Se implementó el flujo de Magic Link Auth mediante SSR utilizando middleware para actualizar y refrescar sesiones de forma transparente.
- **Providers:** Se agruparon en `AppProviders` (`src/lib/providers/app-providers.tsx`) para inyectarlos en el Root Layout limpiamente.
- **Theme Provider:** Se forzó el `defaultTheme="dark"` con `enableSystem={false}` para cumplir estrictamente con la especificación (Dark mode por defecto y sin light mode en MVP).
- **Zustand:** Se implementó `useAppStore` para el manejo base del estado global cliente, preparado para coordinar el sidebar y otras interacciones visuales simples.

### Problemas encontrados

- **Manejo del Request Cookies en Next.js Middleware:** La API de Supabase `setAll` requería adaptación a la nueva firma de `request.cookies.set()` que no acepta el parámetro `options` en la misma posición, resuelto omitiendo iterar opciones que no soporta.
- **Build con validación Zod Env:** Next.js turbopack intentó evaluar `env.ts` para capturar la data estática, fallando por falta de secretos. Resuelto creando archivo `.env.local` y `.env.example` con stubs que superan validación URL.

### Próximos pasos

Iniciar Sprint 0.3.

---

# Sprint 0.3

**Estado:** Completado (A la espera de credenciales para migraciones)

## Objetivo

Finalizar la configuraci�n de la infraestructura base (Fase 0), integrando Prisma (Base de Datos) y la observabilidad (Pino Logger, Sentry), adem�s de preparar el despliegue a Vercel.

### Alcance

- Integraci�n de Prisma Client Singleton en \src/lib/db/client.ts\.
- Implementaci�n de helpers de transacciones (\withTransaction\) y seguridad RLS (\setWorkspaceId\).
- Integraci�n de Sentry de forma 100% manual (\sentry.client.config.ts\, \sentry.server.config.ts\, \sentry.edge.config.ts\, \instrumentation.ts\, \
  ext.config.ts\).
- Configuraci�n de Pino Logger estructurado.
- Middleware para inyectar \x-request-id\ en cada petici�n.
- Correcci�n de sintaxis de relaciones Prisma en \schema.prisma\.

### Fuera del alcance

- Conexi�n a bases de datos de desarrollo temporal o local.
- L�gica de negocio de la Fase 1.
- Ejecutar migraciones automatizadas sin autorizaci�n expl�cita y credenciales de producci�n.

### Resultado

Completado a nivel de c�digo. La infraestructura se encuentra lista. Se validaron los tipos, linter y build general satisfactoriamente (\pnpm build\, \pnpm lint\, \pnpm typecheck\). Prisma gener� su cliente local sin problemas (\
px prisma generate\).

### Decisiones t�cnicas

- **Prisma v6:** Se opt� por Prisma 6 en lugar de Prisma 7 para evitar incompatibilidades de configuraci�n no documentadas o inestables con el esquema pre-existente, preservando la compatibilidad de \url\ y \directUrl\ sin requerir configuraciones de adaptadores complejas.
- **Sentry Manual:** Se implement� manualmente y de forma limpia en lugar de utilizar el \@sentry/wizard\, evitando c�digo generado residual.
- **Relaciones Prisma:** Se corrigi� un error de ambig�edad en \schema.prisma\ donde las relaciones 1-a-1 entre \Prospect\ y \Lead\ colisionaban. Se resolvieron agregando nombres expl�citos y especificando el constraint \@unique\ correcto en el modelo \Lead\.

### Problemas encontrados

- **Build ignorados en pnpm:** pnpm bloque� la generaci�n del Prisma Client (\@prisma/client\) por restricciones de ejecuci�n de scripts postinstall. Se resolvi� registrando los paquetes expl�citamente en el nodo \pnpm.approvedBuilds\ de \package.json\.

---

# Sprint 0.4

**Estado:** Completado (Cierre de Phase 0)

## Objetivo

Auditor�a t�cnica general y preparaci�n final de la infraestructura para dar paso a la Phase 1. No se implementaron nuevas funcionalidades, sino que se estabiliz� la base actual.

### Alcance

- Auditor�a de dependencias, seguridad, estructura de archivos y consistencia del c�digo.
- Revisi�n de la configuraci�n para despliegue en Vercel (Supabase, Sentry, Prisma).
- Verificaci�n final exhaustiva (\lint\, \ ypecheck\, \uild\).
- Elaboraci�n de propuesta t�cnica (plan de implementaci�n) para la Phase 1 enfocada en AXIOM Growth (m�dulo de prospecci�n y generaci�n de ingresos).

### Resultado

Completado. La base de c�digo de la Phase 0 (Foundation) se encuentra 100% estable y lista para escalar. No hay advertencias de linter, y los tipos de TypeScript est�n completamente alineados.

### Decisiones t�cnicas

- **Mantenimiento de Dependencias:** Se decidi� NO actualizar Prisma a 7.x ni React a 19.2.7 para preservar la estabilidad obtenida con Prisma 6.19.3, evitando la introducci�n de bugs relacionados a configuraciones de adaptadores y conexiones directas de DB en la capa SSR.
- **Preparaci�n Vercel/Supabase:** La integraci�n qued� condicionada a la inyecci�n final de variables de entorno en Vercel por parte del usuario, manteniendo la seguridad de las credenciales fuera del repositorio.

---

# Sprint 1.1

**Estado:** Completado

## Objetivo

Sentar las bases (Foundations) de integraci�n de datos e inteligencia artificial para AXIOM Growth, aislando el proyecto de proveedores espec�ficos.

### Alcance

- Soluci�n definitiva al issue de scripts de construcci�n de pnpm configurando \llowBuilds\ en \pnpm-workspace.yaml\.
- Implementaci�n de \src/lib/ai/router.ts\ y adaptador de \Anthropic\.
- Dise�o escalable de prompts tipados en \src/lib/ai/prompts\.
- Agregada observabilidad (Pino) registrando inputs, outputs, duraci�n y costo en peticiones IA.
- Implementaci�n de \src/lib/adapters/places/router.ts\ y adaptador \Google Places (New)\ con fetch nativo.
- Verificaci�n exhaustiva superada.

---

# Sprint 1.2

**Estado:** Completado

## Objetivo

Construir completamente el backend del m�dulo AXIOM Growth (Prospecting Engine).

### Alcance

- Creaci�n de la arquitectura Domain-Driven Design (DDD) con separaci�n de Entities, Repositories, Services, Use Cases, Validators y DTOs.
- Ejecuci�n exitosa de la migraci�n de Prisma \init_growth\ y validaci�n del modelo Prospect en Supabase.
- Desarrollo de \SearchProspectsUseCase\, \AnalyzeProspectUseCase\ y \QueryProspectsUseCase\.
- Integraci�n del AI Router con Anthropic para el an�lisis de prospectos usando tipado estricto.
- Definici�n de validadores robustos con Zod.
- Cumplimiento de reglas de calidad (Lint, TypeScript strict, Next Build).
