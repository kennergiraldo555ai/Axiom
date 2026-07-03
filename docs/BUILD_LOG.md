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
