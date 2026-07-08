# AXIOM Engineering Decisions

**Project:** AXIOM

**Document Type:** Architecture Decision Log

**Status:** Active

**Version:** 1.0.0

**Last Updated:** 2026-07-03

---

# Purpose

This document records every important technical decision made during the lifetime of AXIOM.

The objective is not only to remember _what_ was decided, but also _why_ it was decided, what alternatives were considered, and what consequences the decision has for the future of the project.

This document prevents the loss of engineering knowledge over time.

---

# Decision Rules

Every architectural or strategic decision that affects the long-term evolution of AXIOM must be documented here.

Minor implementation details do not belong in this document.

Examples of decisions that must be recorded:

- Technology selection
- Framework changes
- Database strategy
- Authentication strategy
- Repository structure
- State management
- Design System
- Deployment strategy
- CI/CD
- AI architecture
- Security model
- Major dependencies
- Domain boundaries
- API strategy
- Performance strategy

---

# Decision Template

Every decision must follow this structure.

---

## Decision ID

AXIOM-XXXX

---

## Date

YYYY-MM-DD

---

## Status

- Proposed
- Approved
- Deprecated
- Superseded

---

## Title

Short descriptive title.

---

## Context

Why this decision became necessary.

---

## Decision

What was decided.

---

## Alternatives Considered

Option A

Advantages

Disadvantages

---

Option B

Advantages

Disadvantages

---

## Why This Decision Was Chosen

Explain the engineering reasoning.

Never write:

"Because it is better."

Explain objectively.

---

## Consequences

Positive consequences

Negative consequences

Future implications

---

## Risks

Potential long-term risks.

---

## Related Documents

- AXIOM_Master_Spec.md
- BUILD_LOG.md
- ADR
- AI_DEVELOPMENT_RULES.md

---

# Decision Log

---

# AXIOM-0001

## Date

2026-07-03

## Status

Approved

## Title

Adopt Sprint-Based Development

## Context

AXIOM is expected to evolve for many years with multiple AI systems collaborating simultaneously.

Without strict sprint boundaries, AI agents may implement features outside the intended scope, causing architectural drift and unnecessary technical debt.

## Decision

All development must be organized into clearly defined Sprints.

Every Sprint has an explicit scope.

No implementation may extend beyond the approved Sprint.

## Alternatives Considered

### Continuous development

Advantages

- Faster initial implementation

Disadvantages

- Scope creep
- Harder reviews
- Increased technical debt

### Sprint-based development

Advantages

- Predictable progress
- Easier reviews
- Better planning
- Better architecture

Disadvantages

- Slightly slower feature delivery

## Why This Decision Was Chosen

Long-term maintainability is more valuable than short-term speed.

## Consequences

Positive

- Controlled evolution
- Cleaner commits
- Easier debugging

Negative

- More planning required

---

# AXIOM-0002

## Date

2026-07-03

## Status

Approved

## Title

Architecture Changes Require Explicit Approval

## Context

AI systems often attempt to improve software automatically.

Although beneficial, these changes may unintentionally introduce inconsistencies or alter the long-term architecture.

## Decision

Any architectural modification must stop the implementation process and request explicit approval.

## Consequences

Positive

- Full architectural control

Negative

- Slightly slower implementation

---

# AXIOM-0003

## Date

2026-07-03

## Status

Approved

## Title

AI Must Never Guess Missing Requirements

## Context

Incorrect assumptions made by AI frequently generate unnecessary rework.

## Decision

Whenever documentation is ambiguous:

Stop.

Present alternatives.

Explain trade-offs.

Wait for approval.

---

# AXIOM-0004

## Date

2026-07-03

## Status

Approved

## Title

GitHub as Single Source of Version History

## Context

The project requires a reliable, centralized history of every change.

## Decision

Every approved Sprint must end with:

- Clean commit
- Push to GitHub
- Updated BUILD_LOG.md

No Sprint is considered complete until all three actions are finished.

---

# AXIOM-0005

## Date

2026-07-03

## Status

Approved

## Title

Long-Term Maintainability Over Development Speed

## Context

AXIOM is intended to become a platform that will evolve for many years.

Temporary shortcuts often become permanent technical debt.

## Decision

Whenever speed conflicts with maintainability:

Maintainability always wins.

---

# Future Decisions

Every new architectural decision must be appended below using the same template.

Existing decisions must never be rewritten.

If a decision changes:

Create a new decision referencing the previous one.

This preserves the historical evolution of AXIOM.

---

# Engineering Principle

Good software is not the result of perfect decisions.

It is the result of documented decisions that can be understood, challenged and improved over time.

### 4. AI Provider Abstraction (AI Router)

- **Decisi�n:** Implementar \src/lib/ai/router.ts\ como una capa de abstracci�n para modelos LLM (Anthropic como primer proveedor).
- **Razonamiento:** Previene vendor lock-in a nivel de framework de IA. Vercel AI SDK fue descartado temporalmente por acoplar excesivamente el backend con componentes UI y asumir flujos de streaming para Chat, mientras que AXIOM Growth requiere procesamiento en background as�ncrono para Prospecting. Adem�s, facilita la observabilidad detallada.
- **Fecha:** Sprint 1.1

### 5. Places Provider Abstraction

- **Decisi�n:** Implementar \src/lib/adapters/places/router.ts\ para abstraer el origen de datos de prospectos (Google Places API New como primer adaptador).
- **Decisin:** Implementar \src/lib/adapters/places/router.ts\ para abstraer el origen de datos de prospectos (Google Places API New como primer adaptador).
- **Razonamiento:** Evita acoplar la lgica de negocio a un nico proveedor de datos, permitiendo inyectar Yelp u otras fuentes en el futuro.
- **Fecha:** Sprint 1.1

### 6. Prospecting Domain Architecture

- **Decisin:** Implementar Clean Architecture estricta en el mdulo \growth/prospecting\ separando en \domain/\, \ pplication/\, \infrastructure/\ y \presentation/\.
- **Razonamiento:** El mdulo Prospecting es el ncleo de AXIOM Growth. Separar entidades, validadores, casos de uso y repositorios garantiza que la lgica de negocio pueda testearse y escalar sin depender de Prisma o de Next.js directamente.
- **Fecha:** Sprint 1.2

---

# AXIOM-0006

## Date

2026-07-07

## Status

Approved

## Title

Gemini como proveedor activo de IA (reemplaza Anthropic como default)

## Context

Durante Sprint 1.1 se implementó el AIRouter con Anthropic como primer adaptador documentado.
En el Sprint de Estabilización Final se determinó que `AI_PROVIDER=gemini` es el proveedor activo en `.env.local`.
Los use cases `AnalyzeProspectUseCase` y `GenerateProposalUseCase` tenían hardcodeado `claude-3-5-sonnet-20240620` como modelo fallback, causando un error 400 del SDK de Gemini al enviar un nombre de modelo inválido.

## Decision

El AIRouter mantiene su arquitectura multi-proveedor sin cambios.

El proveedor activo se controla exclusivamente mediante la variable de entorno `AI_PROVIDER`.

Los use cases detectan el provider activo y seleccionan el modelo fallback correcto:

- `AI_PROVIDER=gemini` → modelo default: `gemini-1.5-flash`
- `AI_PROVIDER=anthropic` → modelo default: `claude-3-5-sonnet-20240620`

El modelo puede sobreescribirse con la variable `DEFAULT_AI_MODEL` en cualquier entorno.

## Alternatives Considered

### Hardcodear Gemini en los use cases

Ventajas: simplicidad.

Desventajas: rompe el principio de abstracción del AIRouter y hace imposible usar Anthropic sin modificar código.

### Mantener el modelo fallback como Claude

Ventajas: ninguna cuando el provider es Gemini.

Desventajas: error garantizado en tiempo de ejecución.

## Why This Decision Was Chosen

Preserva la arquitectura multi-proveedor existente sin cambios estructurales.
El cambio es mínimo (detección del provider en runtime) y no rompe ninguna funcionalidad existente.

## Consequences

Positivas:

- Gemini funciona correctamente sin cambiar la arquitectura
- Anthropic sigue siendo un adaptador válido y funcional
- El modelo puede configurarse por entorno sin tocar código

Negativas:

- Si se agrega un tercer provider sin modelo default, el fallback seguirá siendo Claude o Gemini

## Risks

Si se introduce un nuevo provider y no se añade un caso en la lógica de detección, el modelo fallback podría ser incorrecto.
Documentado como deuda técnica menor para el próximo sprint.

## Related Documents

- AXIOM_Master_Spec.md
- docs/AI_DEVELOPMENT_RULES.md
- src/lib/ai/router.ts
- src/lib/ai/gemini.ts
