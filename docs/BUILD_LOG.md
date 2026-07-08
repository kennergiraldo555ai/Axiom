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

 
 

# Sprint 1.3: AXIOM Growth Prospecting MVP

**Fecha:** 4 de Julio de 2026
**Rol:** AXIOM Frontend Engineer

**Estado:** Completado

## Objetivo

Construir la primera versión completamente utilizable del módulo AXIOM Growth (Prospecting Engine) enfocándose en la interfaz de usuario, accesibilidad, y componentes genéricos del Design System.

### Alcance

- Creación de componentes compartidos en src/modules/_shared/components/.
- Implementación de Server Actions.
- Construcción de componentes específicos del dominio.
- Implementación de la página principal Server Component.
- Verificación estricta de Accessibility (ARIA, Keyboard Nav).
- Manejo de Errores detallado.
- Cumplimiento de reglas de calidad (Lint, TypeScript strict, Next Build).

# Sprint 1.4: UX/UI Premium Refactor

**Fecha:** 4 de Julio de 2026
**Rol:** AXIOM Staff Frontend Engineer & Product Designer

**Estado:** Completado

## Objetivo

Realizar una auditoría completa (Visual, UX, Accesibilidad, Performance) y refactorizar la UI hacia un estándar Premium (inspirado en Linear/Vercel).

### Alcance

- Transición de la paleta a True Black y acentos Índigo/Violeta ( okens.css).
- Eliminación de todos los inline styles en Layout y reescritura en Tailwind v4.
- Rediseño de Sidebar para acomodar crecimiento futuro (Growth, Sales, Analytics).
- Incremento agresivo de espacio en blanco, padding y suavizado de sombras.
- Refactorización del ProspectSidePanel hacia un layout CRM profesional (AI Analysis organizado visualmente).
- Cumplimiento de reglas de accesibilidad (Focus rings constantes).
- Pase exitoso de Lint, Typecheck y Build Next.js.

---

# Sprint Estabilización Final (2026-07-07)

**Estado:** Completado (solo desarrollo local — sin commit/push por instrucción explícita del usuario)

## Objetivo

Cerrar completamente el módulo Growth Prospecting. Sin nuevas funcionalidades.

### Problema 1 — Gemini API Key inválida

**Causa raíz:** `.env.local` contenía el placeholder literal `INSERT_YOUR_GEMINI_KEY`. Ningún cambio de código puede solucionarlo — requiere que el usuario coloque su clave real.

**Bug adicional en código corregido:** Los use cases `AnalyzeProspectUseCase` y `GenerateProposalUseCase` tenían `"claude-3-5-sonnet-20240620"` como modelo fallback. Cuando `AI_PROVIDER=gemini`, el SDK de Gemini rechazaba ese nombre de modelo con error 400. Corregido para detectar el provider activo y usar `gemini-1.5-flash` como fallback cuando corresponde.

### Problema 2 — Regresión de cobertura de prospectos (20 → 16)

**Causa raíz:** `ProspectService.deduplicate()` comparaba nombres normalizados contra los prospectos ya existentes en DB. La normalización `str.toLowerCase().replace(/[^a-z0-9]/g, "")` eliminaba tildes y espacios causando falsos positivos (p.ej. "Barbería El Rey" y "Barbería El Reyecito" colapsaban al mismo hash). Negocios válidos eran descartados como duplicados.

**Solución:** Se eliminó la comparación por nombre normalizado contra DB. Se mantiene la deduplicación por `placeId` exacto y teléfono exacto (identificadores inequívocos). La deduplicación por nombre se mantiene únicamente entre los resultados nuevos de la misma búsqueda (para evitar duplicados entre variantes).

### Archivos modificados

- `src/modules/growth/prospecting/application/use-cases/analyze-prospect.use-case.ts`
- `src/modules/growth/prospecting/application/use-cases/generate-proposal.use-case.ts`
- `src/modules/growth/prospecting/domain/services/prospect.service.ts`
- `docs/BUILD_LOG.md` (este documento)
- `docs/DECISIONS.md`
- `docs/AI_DEVELOPMENT_RULES.md`

### Validación

- pnpm lint ✓
- pnpm typecheck ✓
- pnpm build ✓

---

# Sprint Estabilización UX (Local)

**Estado:** Completado (solo desarrollo local — sin commit/push por instrucción explícita del usuario)

## Objetivo

Corregir dos regresiones críticas de UX (pérdida de estado y pantalla negra durante carga) y traducir el análisis de IA al español neutro.

### Problema 1 — Análisis de IA en inglés

**Causa raíz:** El prompt `evaluateProspectPrompt` en `prospecting.ts` estaba escrito en inglés y no instruía a la IA a responder explícitamente en español, provocando que los textos del JSON se generaran en inglés.
**Solución aplicada:** Se tradujeron el `systemPrompt` y el `userPrompt` al español neutro, agregando una instrucción crítica (CRÍTICO) para que la salida conserve la estructura JSON pero genere todo el contenido en español enfocado en LATAM.
**Por qué no rompe el resto del sistema:** No se modificaron las llaves del JSON, por lo que el parseo en `AnalyzeProspectUseCase` y el renderizado en la UI siguen funcionando perfectamente.

### Problema 2 y 3 — UI Rota (Pantalla Negra) y Pérdida del Estado de Búsqueda

**Causa raíz (Componentes responsables):**

1. En `ProspectSidePanel`, la función `onUpdate()` se llamaba sin argumentos.
2. En `ProspectLayout`, `onUpdate` apuntaba directamente a `fetchProspects()`, la cual, al no recibir filtros de búsqueda, ejecutaba una carga general de base de datos (`getProspectsAction({})`).
3. Esto no solo reemplazaba el estado actual de la búsqueda (`prospects`) con la lista general, sino que además forzaba `setPageState("loading")`. Al cambiar el estado a "loading", el componente `<ProspectTable>` se desmontaba por completo (pantalla negra), y al finalizar, la UI mostraba resultados distintos a los que el usuario estaba viendo.
   **Solución aplicada:**
4. Los Use Cases y Actions de IA (`analyzeProspectAction`, etc.) ya retornaban el `ProspectEntity` actualizado.
5. Se actualizó la firma de `onUpdate` en `<ProspectSidePanel>` para aceptar `(updatedProspect?: ProspectEntity)`.
6. Se implementó `handleUpdate` en `ProspectLayout` que, al recibir un prospecto actualizado, simplemente lo reemplaza en el array local de estado (`prospects.map`) sin disparar un nuevo fetch ni cambiar `pageState`.
   **Por qué no rompe el resto del sistema:**
   Evita completamente peticiones de red redundantes y montajes innecesarios. Se preservan la búsqueda, el scroll, y el panel lateral intactos. Es un cambio puramente de React State (local).

---

# Sprint Mejora UX: Persistencia Inteligente del Análisis IA

**Estado:** Completado (Local)

## Objetivo

Resolver la falta de inmediatez en la interfaz después de generar el análisis IA (el backend ya guardaba en base de datos correctamente, pero requería recargar para visualizar).

## Solución (Patrón Optimista Controlado)

Se implementó un patrón de "Actualización Optimista Controlada" para toda interacción con Gemini/Claude:

1. Las Server Actions (`analyzeProspectAction`, etc.) retornan el objeto `ProspectEntity` completo actualizado directamente de la BD tras la transacción exitosa.
2. La interfaz de usuario (`ProspectSidePanel` -> `ProspectLayout`) inyecta este objeto retornado en el React State usando `current.map(p => p.id === updated.id ? updated : p)`.
3. No existe un estado de `prospect` paralelo: Todo el flujo consume del mismo arreglo `prospects` mantenido por `<ProspectLayout>`.

## Patrón de UX Implementado

- **Skeleton Elegante:** Durante el análisis (`isAnalyzing`), se reemplaza el empty state por una maqueta animada (`Skeleton`) idéntica a la estructura final del bloque de inteligencia. El botón de análisis se mantiene visible y deshabilitado.
- **Cero Remounts:** No se utilizan tiempos de espera (`setTimeout`) ni desmontajes de contexto.
- **Mantenimiento de Estado:** El scroll, la búsqueda activa (Hoteles vs Barberías) y la selección del panel permanecen intactos.

## Reutilización

Este mismo patrón **DEBE** emplearse para futuras integraciones: Generar Propuesta, Convertir a Lead, Chat Contextual, etc. Siempre:

1. Invocar Action.
2. Mantener UI viva (loading state local a la sección).
3. Obtener Entity en `data`.
4. Hacer `onUpdate(response.data)`.
5. BD sigue siendo la única fuente de verdad, React solo la refleja instantáneamente.

---

# Sprint UI-2

**Estado:** Completado

## Objetivo

Transformar la experiencia de entrada a Prospecting en un flujo Enterprise Premium, garantizando cero carga automatica de datos y cero regresiones funcionales.

### Cambios Implementados

- **Layout Inicial:** Se elimino el useEffect que gatillaba fetchProspects en montaje.
- **Componentes Base:** Se genero EmptyState.tsx reutilizable con glassmorphism, glows y soporte de animaciones en /src/modules/_shared/components/.
- **Skeletons:** Se reescribio el esqueleto de carga general a un ProspectGridSkeleton con animaciones Premium (shimmer) que imita exactamente la presentacion final de los resultados.
- **Busqueda:** Se purgo el datalist nativo y se unificaron las alturas y bordes (h-10) del input de categorias y el CityAutocomplete.

### Resultado

Completado. La experiencia de busqueda ahora es 100% deliberada: comienza con un estado vacio inspirador, exige interaccion consciente del usuario y entrega una carga asincrona espectacular sin desmejorar el motor de cache preexistente.
