# ADR-0001: Monorepo — Next.js App Router

**Number:** ADR-0001
**Status:** Accepted
**Date:** 2026-07-03
**Deciders:** Lead Architect, AXIOM project

---

## Context

AXIOM will eventually encompass 12+ modules (CRM, AI Workforce, Finance, Trading, etc.).
We needed an architecture that:
- Ships fast for the MVP (single deployable unit)
- Doesn't require a rewrite when adding modules
- Has excellent TypeScript DX
- Deploys natively on Vercel

## Decision

Single Next.js 16 App Router application deployed as one Vercel project.
Modules are folder boundaries inside `src/modules/` — not separate services.

## Consequences

### Positive
- Zero infrastructure overhead: one deployment, one database, one domain
- Server Components reduce client-side JS to a minimum
- Server Actions eliminate REST boilerplate for mutations
- `src/modules/<name>/` convention makes modules navigable and replaceable
- Can extract modules into separate services later if needed (the interface is already the boundary)

### Negative
- A bug in the build pipeline affects all modules simultaneously
- The codebase will grow large — folder organization is the only modularity tool

### Neutral
- Requires discipline to respect module boundaries (enforced by ESLint rules in future)

## References

- Next.js 16 App Router: https://nextjs.org/docs/app
- AXIOM_Master_Spec.md §2.1, §2.4
