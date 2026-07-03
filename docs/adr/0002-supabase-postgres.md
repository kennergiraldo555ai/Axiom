# ADR-0002: Database — Supabase + Postgres + Prisma

**Number:** ADR-0002
**Status:** Accepted
**Date:** 2026-07-03
**Deciders:** Lead Architect, AXIOM project

---

## Context

We need a database that:
- Provides Row-Level Security (RLS) for multi-workspace data isolation
- Has built-in Auth (magic link + OAuth) to avoid maintaining our own auth layer
- Has Realtime capabilities for live UI updates during AI analysis
- Has a managed Postgres instance with good DX
- Has a TypeScript-first ORM with schema-as-source-of-truth

## Decision

- **Database**: Supabase Postgres (hosted)
- **ORM**: Prisma 6 (migrations as code, TypeScript types auto-generated)
- **Auth**: Supabase Auth (integrated with RLS via JWT claims)
- **RLS**: Enabled on every table; `workspace_id` is the isolation key
- **Connection**: Pooled connection via DATABASE_URL, direct via DIRECT_URL for migrations

## Consequences

### Positive
- Auth + RLS + Realtime + Storage in one platform
- Prisma generates typed client from schema — no manual type maintenance
- `workspace_id` column on every table means future multi-tenancy is a policy change, not a schema rewrite
- Supabase free tier is sufficient for MVP

### Negative
- Vendor lock-in on Supabase Auth and RLS policies
- Prisma is slower than Drizzle (but DX wins for a decade-long project)
- Migrations must be managed carefully — never edit merged migrations

### Neutral
- Supabase imposes a connection limit on free tier — mitigated by PgBouncer pooling

## References

- Supabase RLS docs: https://supabase.com/docs/guides/database/row-level-security
- Prisma docs: https://www.prisma.io/docs
- AXIOM_Master_Spec.md §2.4, §5.1, §5.3
