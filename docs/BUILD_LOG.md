# AXIOM Build Log

Este documento registra la evolución técnica del proyecto.

Nunca debe eliminarse información.

Cada Sprint debe añadir una nueva entrada.

---

# Sprint 0.1

**Estado:** En progreso

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

### Próximos pasos

Iniciar Sprint 0.2
