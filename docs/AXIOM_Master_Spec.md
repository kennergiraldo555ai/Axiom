# AXIOM — Master Implementation Specification

**Document type:** Implementation Specification for Antigravity
**Project:** AXIOM (Foundation + AXIOM Growth MVP)
**Author:** Lead Software Architect
**Status:** LOCKED — Ready for Antigravity execution
**Date:** 2026-07-03

---

## 0. Executive Summary

AXIOM is a personal and business operating system that will eventually encompass twelve or more modules — AI Workforce, CRM, Project Management, Finance, Knowledge Base, Automation, Personal OS, Trading, Analytics, Business Intelligence, AI Agents, and Workflows. This document does NOT specify those modules. It specifies only the **Foundation** (the shared platform every future module will sit on) and the **first MVP module, AXIOM Growth** — a revenue-generating prospecting tool that finds businesses, analyzes them with AI, scores their quality, detects sales opportunities, drafts personalized outreach messages, and converts approved prospects into CRM leads.

The architecture is deliberately over-built for the MVP. Every decision optimizes for the next decade, not the next demo. We use Next.js 16 + Supabase + TypeScript + Prisma + Tailwind + shadcn/ui, deployed on Vercel, with a single-tenant-but-workspace-aware schema, an abstract AI routing layer (Sonnet primary, Opus for quality gates), Google Places API as the data source, manual-review-first outreach with email OAuth integration, and a Linear/Notion hybrid design language.

**Iron rule for Antigravity:** Build the Foundation + AXIOM Growth MVP. Nothing else. Leave hooks for future modules but do not implement them.

---

## 1. Project Objective

### 1.1 The Decade View

AXIOM is not a SaaS. It is the user's personal and business operating system. Over the next ten years it will absorb CRM, finance, project management, knowledge, automation, trading, analytics, agents, and more. Each of those modules will share the same authentication, the same data plane, the same design system, the same observability, and the same permission model. Building the Foundation right is the difference between AXIOM becoming a coherent operating system and becoming a pile of disconnected apps that share a domain name.

### 1.2 The MVP Constraint

The first shippable thing must do exactly one thing well: **generate revenue by finding and converting potential customers**. AXIOM Growth's MVP is a prospecting assistant. It is not a bulk emailer. It is not an automated spam engine. It is a tool that helps a human salesperson find high-quality prospects, understand them deeply, draft personalized messages, and manually decide whether to engage. Every feature that does not directly serve that loop is out of scope.

### 1.3 The Growth Loop (MVP)

```
Choose city + category
        ↓
Fetch businesses from Google Places
        ↓
Persist prospect records (idempotent upsert)
        ↓
AI analysis (Sonnet): signals, opportunities, quality score
        ↓
Opus quality gate: review borderline scores, polish top-tier outreach
        ↓
Generate personalized sales message draft
        ↓
Human review + edit (mandatory, no auto-send)
        ↓
Convert approved prospect → CRM lead
        ↓
Outreach (copy to clipboard / open WhatsApp / send reviewed email via OAuth)
        ↓
Track lead status and outcome in CRM
```

### 1.4 Non-Goals (MVP)

- No automated bulk outreach. The MVP must always require a human in the loop before any message is sent.
- No analytics dashboards beyond the four required sections. BI is a future module.
- No team collaboration. Single-user MVP. The schema leaves room for teams but no team features ship.
- No workflow builder. The Outreach + CRM flow is the only workflow. Automation is a future module.
- No AI agent autonomy. The AI analyzes and drafts. It does not act.
- No finance, trading, knowledge base, project management, or personal OS features.

---

## 2. Architecture for the MVP

### 2.1 Architectural Principles

1. **Monorepo, single deployable.** One Next.js app. One Postgres database. One Vercel deployment. Splitting into services is a future problem we earn the right to solve.
2. **Module boundaries are folder boundaries.** Each future AXIOM module gets `src/modules/<module>/`. The Growth module lives at `src/modules/growth/`. Cross-module imports go through a published internal package API, never through deep imports.
3. **Server-first.** Server Components by default. Client Components only where interactivity demands it. API routes (Next.js Route Handlers) for every mutation. No client-side data fetching that bypasses the server.
4. **Type safety end-to-end.** Prisma generates types from the schema. Zod validates every API boundary. UI consumes types generated from the same source.
5. **AI behind a router.** No code outside `src/lib/ai/` may import an LLM SDK directly. Everything goes through `aiRouter.complete({ task, input })`.
6. **External APIs behind adapters.** Google Places, email providers, future integrations — each is an adapter implementing a typed interface. Swap without touching call sites.
7. **Idempotency by default.** Every external-API-backed mutation is idempotent. Every webhook has a deduplication table.
8. **Observability from day one.** Structured logs, request IDs, AI prompt/response persistence, error tracking (Sentry). No `console.log` in production paths.
9. **Security by construction.** Row-Level Security on every table. Auth-required for every API route. Server-side validation on every mutation. No client-trusted data.
10. **Migration-friendly schema.** Every table has `id`, `created_at`, `updated_at`, `deleted_at` (soft delete), `workspace_id` (forward-compatible), and `metadata jsonb` (extension without migration).

### 2.2 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                          Browser (Client)                         │
│  React Server Components + Client Islands (shadcn/ui, TanStack)   │
└──────────────────────────┬───────────────────────────────────────┘
                           │ HTTPS
┌──────────────────────────▼───────────────────────────────────────┐
│                     Vercel (Next.js 16)                           │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  App Router (RSC default)                                    │ │
│  │  /app/(auth) /app/(dashboard) /app/(growth) /app/(crm)       │ │
│  │  Route Handlers (Server Actions for mutations)               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Module Layer (src/modules/growth/*)                         │ │
│  │  - prospecting/, crm/, dashboard/, settings/                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Core Services (src/lib/*)                                   │ │
│  │  - ai/ (router, providers, prompts)                          │ │
│  │  - adapters/ (places, email, oauth)                          │ │
│  │  - db/ (prisma client, transactions)                         │ │
│  │  - auth/ (supabase session helpers)                          │ │
│  │  - observability/ (logger, sentry, metrics)                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────┬──────────────────┬──────────────────┬────────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐  ┌────────────────┐  ┌──────────────────┐
│  Supabase   │  │ Anthropic API  │  │ Google Places    │
│  Postgres   │  │ (Sonnet/Opus)  │  │ API (New)        │
│  + Auth     │  │                │  │                  │
│  + RLS      │  │                │  │                  │
└─────────────┘  └────────────────┘  └──────────────────┘
```

### 2.3 Request Lifecycle (Prospecting Example)

1. User on `/growth/prospecting` submits a search: city + category.
2. Server Action validates input with Zod, calls `ProspectingService.search({ city, category, userId })`.
3. Service calls `placesAdapter.search({ city, category })`, which hits Google Places API (New).
4. Service upserts each result into `prospects` table (idempotent by `place_id`).
5. Service queues AI analysis jobs (one per prospect) — implemented as inline async calls in MVP, replaceable with a queue later.
6. For each prospect: `aiRouter.complete({ task: 'prospect_analysis', input: { prospect } })` returns `{ signals, opportunities, quality_score, score_rationale }`.
7. If quality_score ≥ 80 (high-quality tier): `aiRouter.complete({ task: 'outreach_polish', model: 'opus', input: { prospect, analysis } })` refines the message draft.
8. Service persists analysis + draft. Returns prospect list with scores and drafts to the UI.
9. User reviews, edits the draft inline, clicks "Approve & Convert to Lead".
10. Server Action calls `CrmService.createLead({ prospectId, editedDraft, userId })`, which inserts into `leads` and links back to the prospect.
11. User clicks "Copy" or "Send Email" (OAuth) — the message leaves the system only after explicit human action.

### 2.4 Why These Decisions

| Decision | Chosen | Rejected | Why |
|---|---|---|---|
| Framework | Next.js 16 App Router | Remix, T3, plain Vite | Best DX in Antigravity, RSC ships less JS, Server Actions remove API boilerplate, native to Vercel. |
| Database | Supabase Postgres | Neon, self-hosted | Auth + RLS + Realtime + Storage in one. Auth alone saves weeks. RLS gives us row-level security without app-level checks. |
| ORM | Prisma | Drizzle, raw SQL | Type-safe, migrations as code, schema-as-source-of-truth. Drizzle is faster but Prisma's DX wins for a decade-long project. |
| Auth | Supabase Auth | NextAuth, custom | Tightly integrated with RLS, magic-link + OAuth out of the box, JWT sessions reusable for future WebSocket/edge cases. |
| Styling | Tailwind + shadcn/ui | MUI, Chakra | Copy-paste components we own, no library lock-in, fits Linear/Notion aesthetic. |
| AI Routing | Internal `ai_router` abstraction | Direct SDK calls | Model names change quarterly. Tasks change less often. Decouple task → model mapping. |
| Tenancy | Single-user MVP, `workspace_id` everywhere | Full multi-tenant now | Ship faster, but the column means a future migration is `UPDATE` + RLS policy, not a schema rewrite. |

---

## 3. Folder Structure

The folder structure is the contract. Antigravity must follow it exactly. Future modules plug in at `src/modules/<name>/` without touching anything outside their own folder (except `prisma/schema.prisma` and `app/` route registration).

```
axiom/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # lint + typecheck + test + build
│       └── codeql.yml                # security scan
├── .vscode/
│   └── settings.json
├── docs/
│   ├── architecture.md               # this document's architecture sections
│   ├── adr/                          # Architecture Decision Records
│   │   ├── 0001-monorepo-nextjs.md
│   │   ├── 0002-supabase-postgres.md
│   │   ├── 0003-ai-router-abstraction.md
│   │   └── TEMPLATE.md
│   ├── api/                          # generated API reference
│   ├── runbooks/                     # operational runbooks
│   └── glossary.md
├── prisma/
│   ├── schema.prisma                 # single source of truth
│   ├── migrations/                   # checked in, never edited by hand
│   └── seed.ts                       # idempotent seed
├── public/
│   ├── favicon.ico
│   └── logo.svg
├── scripts/
│   ├── check-env.ts                  # validates required env vars on install
│   ├── seed-categories.ts            # seeds the business_category table
│   └── sync-places-categories.ts     # pulls Google's category taxonomy
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── callback/route.ts     # OAuth callback
│   │   │   └── layout.tsx
│   │   ├── (app)/                    # authenticated shell
│   │   │   ├── layout.tsx            # sidebar + topbar shell
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── growth/
│   │   │   │   ├── prospecting/page.tsx
│   │   │   │   ├── prospecting/[id]/page.tsx
│   │   │   │   └── opportunities/page.tsx
│   │   │   ├── crm/
│   │   │   │   ├── page.tsx          # leads list
│   │   │   │   └── [id]/page.tsx     # lead detail
│   │   │   └── settings/
│   │   │       ├── page.tsx          # profile
│   │   │       ├── integrations/page.tsx
│   │   │       └── ai/page.tsx       # model routing config
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   └── places/route.ts   # future async places webhooks
│   │   │   └── cron/
│   │   │       └── refresh-prospects/route.ts  # scheduled re-analysis
│   │   ├── layout.tsx                # root layout (fonts, providers)
│   │   ├── error.tsx                 # global error boundary
│   │   ├── not-found.tsx
│   │   └── globals.css               # tailwind + design tokens
│   ├── modules/                      # MODULE BOUNDARY
│   │   ├── growth/
│   │   │   ├── prospecting/
│   │   │   │   ├── actions.ts        # Server Actions
│   │   │   │   ├── service.ts        # business logic
│   │   │   │   ├── repository.ts     # DB access (Prisma)
│   │   │   │   ├── schema.ts         # Zod input/output schemas
│   │   │   │   └── components/
│   │   │   │       ├── SearchForm.tsx
│   │   │   │       ├── ProspectCard.tsx
│   │   │   │       ├── ProspectList.tsx
│   │   │   │       ├── AnalysisPanel.tsx
│   │   │   │       ├── ScoreBadge.tsx
│   │   │   │       └── MessageEditor.tsx
│   │   │   ├── crm/
│   │   │   │   ├── actions.ts
│   │   │   │   ├── service.ts
│   │   │   │   ├── repository.ts
│   │   │   │   ├── schema.ts
│   │   │   │   └── components/
│   │   │   │       ├── LeadList.tsx
│   │   │   │       ├── LeadDetail.tsx
│   │   │   │       └── LeadStatusSelect.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── actions.ts
│   │   │   │   └── components/
│   │   │   │       ├── KpiCards.tsx
│   │   │   │       ├── RecentLeads.tsx
│   │   │   │       └── PipelineChart.tsx
│   │   │   └── settings/
│   │   │       └── components/
│   │   ├── _shared/                  # cross-module shared types & UI
│   │   │   ├── types.ts
│   │   │   └── components/
│   │   └── README.md                 # how to add a new module
│   ├── lib/                          # FOUNDATION services
│   │   ├── ai/
│   │   │   ├── router.ts             # aiRouter.complete({ task, input })
│   │   │   ├── providers/
│   │   │   │   ├── anthropic.ts      # Sonnet + Opus adapter
│   │   │   │   └── types.ts          # Provider interface
│   │   │   ├── tasks/
│   │   │   │   ├── prospect_analysis.ts
│   │   │   │   ├── opportunity_detection.ts
│   │   │   │   ├── message_draft.ts
│   │   │   │   └── message_polish.ts
│   │   │   ├── prompts/              # versioned prompt templates
│   │   │   │   ├── prospect_analysis.v1.md
│   │   │   │   └── message_draft.v1.md
│   │   │   ├── cost-tracker.ts       # $ spent per task
│   │   │   └── audit-log.ts          # persist every prompt + response
│   │   ├── adapters/
│   │   │   ├── places/
│   │   │   │   ├── google-places.ts  # Google Places API (New) adapter
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts          # exported interface
│   │   │   ├── email/
│   │   │   │   ├── gmail.ts          # OAuth-based Gmail adapter
│   │   │   │   ├── types.ts
│   │   │   │   └── index.ts
│   │   │   └── oauth/
│   │   │       ├── provider.ts       # generic OAuth flow
│   │   │       └── tokens.ts         # encrypted token store
│   │   ├── db/
│   │   │   ├── client.ts             # Prisma client singleton
│   │   │   ├── transactions.ts       # helpers for tx boundaries
│   │   │   └── rls.ts                # sets local workspace_id for RLS
│   │   ├── auth/
│   │   │   ├── session.ts            # getSession() helper
│   │   │   ├── middleware.ts         # Next.js middleware for auth
│   │   │   └── guards.ts             # requireUser(), requireWorkspace()
│   │   ├── observability/
│   │   │   ├── logger.ts             # pino-based structured logger
│   │   │   ├── request-id.ts
│   │   │   ├── sentry.ts
│   │   │   └── metrics.ts
│   │   ├── validation/
│   │   │   └── zod-helpers.ts        # zod -> openapi, error formatting
│   │   ├── errors/
│   │   │   └── typed-errors.ts       # AppError, NotFoundError, etc.
│   │   ├── config/
│   │   │   └── env.ts                # typed env var loader (zod)
│   │   └── utils/
│   │       ├── result.ts             # Result<T, E> type
│   │       ├── id.ts                 # ULID generator
│   │       └── retry.ts              # exponential backoff helper
│   ├── styles/
│   │   ├── tokens.css                # design tokens (CSS variables)
│   │   └── typography.css
│   ├── types/
│   │   ├── global.d.ts
│   │   └── api.ts                    # shared API contract types
│   └── instrumentation.ts            # OpenTelemetry / Sentry init
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/                          # Playwright
│   └── fixtures/
├── .env.example
├── .eslintrc.cjs
├── .prettierrc
├── biome.json                        # optional fast linter/formatter
├── components.json                   # shadcn config
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

### 3.1 Module Boundary Rules

1. A module may import from `src/lib/*` and `src/modules/_shared/*` freely.
2. A module may NOT import from another module's folder. Cross-module communication happens via the database (reads) or via Server Actions invoked from the UI shell.
3. A module exposes its public API through its own `index.ts` at the module root. Anything not exported there is internal.
4. Routes under `src/app/(app)/<module>/` may import components from `src/modules/<module>/components/` only — never from another module's components.

---

## 4. Recommended Stack

### 4.1 Core Stack

| Layer | Choice | Version | Notes |
|---|---|---|---|
| Runtime | Node.js | 22 LTS | Vercel-native. |
| Language | TypeScript | 5.7+ | `strict: true`, `noUncheckedIndexedAccess: true`. |
| Framework | Next.js | 16 (App Router) | RSC default, Server Actions, Route Handlers. |
| Database | Supabase Postgres | 15+ | RLS enabled. |
| ORM | Prisma | 6+ | Migrations as code. |
| Auth | Supabase Auth | latest | Magic link + OAuth. |
| Styling | Tailwind CSS | 4 | Design tokens as CSS variables. |
| UI library | shadcn/ui | latest | Copy-paste, fully owned. |
| Forms | React Hook Form + Zod | latest | Type-safe forms. |
| Data fetching | TanStack Query | 5+ | For client-side mutations/invalidations. |
| State | Zustand (client) | 5 | Tiny, ergonomic, no boilerplate. |
| Tables | TanStack Table | 8 | Headless, virtualized when needed. |
| Charts | Recharts | 2+ | For Dashboard MVP. |
| Email OAuth | `@googleapis/gmail` + `arctic` | latest | Gmail API + generic OAuth. |
| Logging | pino | 9 | Structured, fast. |
| Errors | Sentry | latest | Source maps uploaded. |
| Validation | Zod | 3+ | Schemas shared between client/server. |
| AI SDK | `@anthropic-ai/sdk` | latest | Direct Anthropic SDK behind our router. |
| Package manager | pnpm | 9+ | Workspaces, fast, disk-efficient. |
| Testing | Vitest + Playwright | latest | Unit/integration + E2E. |
| Linting | ESLint + Biome (optional) | latest | Biome for fast formatting, ESLint for rules. |
| Git hooks | Husky + lint-staged | latest | Pre-commit gates. |
| Email templating | React Email | latest | Type-safe email templates. |

### 4.2 External Services

| Service | Purpose | Cost Tier | Notes |
|---|---|---|---|
| Anthropic API | Claude Sonnet 4.5 + Opus 4 | pay-per-token | Sonnet for high-volume tasks, Opus for quality gates. |
| Google Places API (New) | Prospect data source | $32 / 1k calls (Text Search) + $0 / Place Details | Place Details are free with Text Search. Cache aggressively. |
| Supabase | Postgres + Auth + Storage | Free tier → Pro $25/mo | Single region initially. |
| Vercel | Hosting + Edge functions | Pro $20/mo | Required for Next.js 16 cron + Edge. |
| Sentry | Error tracking | Free tier → Team $26/mo | Source maps uploaded on every deploy. |
| Resend (optional) | Transactional email fallback | Free 3k/mo | Only if Gmail OAuth is insufficient. |

### 4.3 Future-Ready Choices

- **Edge runtime**: All route handlers are marked `runtime = 'nodejs'` by default but written to be edge-compatible where possible (no Node-only APIs), so future edge migration is cheap.
- **WebSockets**: Supabase Realtime used for live updates (e.g., prospect analysis completion). No separate WS server to operate.
- **Background jobs**: MVP uses inline async + Next.js cron route handlers. The interface (`enqueueJob(task, payload)`) is abstracted so we can swap in Inngest, Trigger.dev, or a self-hosted queue later without rewriting call sites.

---

## 5. Database Design

### 5.1 Design Principles

1. **Every table has**: `id` (ULID, string), `created_at`, `updated_at`, `deleted_at` (nullable, soft delete), `workspace_id` (default to user's personal workspace — forward-compatible), `metadata jsonb` (extension without migration).
2. **Row-Level Security** is enabled on every table. The default policy denies all; per-table policies explicitly grant access by `workspace_id` matching the authenticated user's session.
3. **Money and rates**: stored as integer minor units (cents). Never floats.
4. **Enums** for status fields. Stored as Postgres enums.
5. **Foreign keys** with `ON DELETE RESTRICT` by default. Cascade only when explicitly justified in an ADR.
6. **Indexes** on every foreign key, every `workspace_id`, and every commonly-filtered column. Composite indexes for known query patterns.
7. **No business logic in DB** beyond constraints and RLS. No triggers except for `updated_at` maintenance.
8. **Migrations are immutable**. Once merged, never edited. To fix, add a new migration.

### 5.2 Schema (Prisma)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../node_modules/.prisma/client"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================================
// FOUNDATION TABLES
// ============================================================

model Workspace {
  id          String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  name        String
  slug        String   @unique
  plan        Plan     @default(FREE)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  deletedAt   DateTime? @map("deleted_at")

  users       User[]
  prospects   Prospect[]
  leads       Lead[]
  categories  BusinessCategory[]
  aiCosts     AiCostRecord[]
  apiKeys     ApiKey[]
  integrations Integration[]

  @@map("workspaces")
}

model User {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  email         String   @unique
  name          String?
  avatarUrl     String?  @map("avatar_url")
  role          UserRole @default(MEMBER)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: RESTRICT)

  @@index([workspaceId])
  @@map("users")
}

model ApiKey {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  provider      String   // 'anthropic' | 'google_places' | 'gmail'
  encryptedKey  String   @map("encrypted_key")  // AES-256-GCM
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)

  @@unique([workspaceId, provider])
  @@index([workspaceId])
  @@map("api_keys")
}

model Integration {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  provider      String   // 'gmail' | 'outlook' | ...
  status        IntegrationStatus @default(DISCONNECTED)
  metadata      Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)

  @@index([workspaceId])
  @@map("integrations")
}

model AiCostRecord {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  taskId        String   @map("task_id")  // 'prospect_analysis' etc.
  model         String   // 'claude-sonnet-4-5' etc.
  inputTokens   Int      @map("input_tokens")
  outputTokens  Int      @map("output_tokens")
  costUsdCents  Int      @map("cost_usd_cents")
  createdAt     DateTime @default(now()) @map("created_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)

  @@index([workspaceId, createdAt])
  @@index([taskId])
  @@map("ai_cost_records")
}

model AiPromptLog {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  taskId        String   @map("task_id")
  model         String
  inputHash     String   @map("input_hash")  // SHA-256 of input
  inputJson     Json     @map("input_json")
  outputJson    Json     @map("output_json")
  durationMs    Int      @map("duration_ms")
  tokensIn      Int      @map("tokens_in")
  tokensOut     Int      @map("tokens_out")
  errorMessage  String?  @map("error_message")
  createdAt     DateTime @default(now()) @map("created_at")

  @@index([workspaceId, createdAt])
  @@index([taskId])
  @@index([inputHash])
  @@map("ai_prompt_logs")
}

// ============================================================
// AXIOM GROWTH TABLES
// ============================================================

model BusinessCategory {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String?  @map("workspace_id")  // null = global taxonomy
  label         String   // "Barbershops"
  googlePlaceType String @map("google_place_type")  // "hair_care"
  icon          String?
  createdAt     DateTime @default(now()) @map("created_at")

  workspace     Workspace? @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)
  prospects     Prospect[]

  @@unique([workspaceId, label])
  @@map("business_categories")
}

model City {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  name          String   // "Madrid"
  countryCode   String   @map("country_code")  // "ES"
  lat           Float
  lng           Float
  placeId       String?  @map("place_id")  // Google Places ID for the city
  createdAt     DateTime @default(now()) @map("created_at")

  prospects     Prospect[]

  @@unique([name, countryCode])
  @@map("cities")
}

model Prospect {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  placeId       String   @map("place_id")  // Google Places ID — idempotency key
  name          String
  categoryId    String?  @map("category_id")
  cityId        String?  @map("city_id")
  address       String?
  phone         String?
  website       String?
  email         String?  // from website scraping or Google
  rating        Float?
  userRatingsCount Int?  @map("user_ratings_count")
  priceLevel    Int?     @map("price_level")  // 0-4
  businessStatus String? @map("business_status")
  googleUrl     String?  @map("google_url")
  lat           Float?
  lng           Float?
  metadata      Json     @default("{}")  // raw Places response, photos, hours
  // Analysis fields
  analysisStatus AnalysisStatus @default(PENDING) @map("analysis_status")
  qualityScore   Int?     @map("quality_score")  // 0-100
  scoreRationale Json?    @map("score_rationale")
  signals        Json?    // { has_website: bool, low_rating: bool, ... }
  opportunities  Json?    // [{ type: 'no_online_booking', severity: 'high', ... }]
  analyzedAt     DateTime? @map("analyzed_at")
  analyzedByModel String? @map("analyzed_by_model")
  // Outreach fields
  messageDraft   String?  @map("message_draft")
  messageDraftModel String? @map("message_draft_model")
  messageDraftAt DateTime? @map("message_draft_at")
  messageEdited  String?  @map("message_edited")  // user-edited version
  userNotes      String?  @map("user_notes")
  // Conversion
  convertedToLeadId String? @map("converted_to_lead_id")
  // Soft delete + timestamps
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)
  category      BusinessCategory? @relation(fields: [categoryId], references: [id], onDelete: SET NULL)
  city          City? @relation(fields: [cityId], references: [id], onDelete: SET NULL)
  lead          Lead? @relation(fields: [convertedToLeadId], references: [id], onDelete: SET NULL)

  @@unique([workspaceId, placeId])
  @@index([workspaceId, cityId, categoryId])
  @@index([workspaceId, qualityScore])
  @@index([workspaceId, analysisStatus])
  @@index([workspaceId, convertedToLeadId])
  @@map("prospects")
}

model Lead {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  workspaceId   String   @map("workspace_id")
  prospectId    String?  @map("prospect_id")  // nullable: leads can exist without prospect
  name          String
  businessName  String?  @map("business_name")
  email         String?
  phone         String?
  website       String?
  source        LeadSource @default(PROSPECTING)
  status        LeadStatus @default(NEW)
  qualityScore  Int?     @map("quality_score")
  // Message that was sent
  finalMessage  String?  @map("final_message")
  // Pipeline
  priority      Int      @default(0)
  assignedToId  String?  @map("assigned_to_id")
  lastContactedAt DateTime? @map("last_contacted_at")
  nextFollowUpAt DateTime? @map("next_follow_up_at")
  // Outreach audit
  outreachChannel String? @map("outreach_channel")  // 'email' | 'whatsapp' | 'copy'
  outreachSentAt  DateTime? @map("outreach_sent_at")
  // Metadata
  metadata      Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  workspace     Workspace @relation(fields: [workspaceId], references: [id], onDelete: CASCADE)
  prospect      Prospect? @relation(fields: [prospectId], references: [id], onDelete: SET NULL)
  activities    LeadActivity[]
  events        LeadEvent[]

  @@index([workspaceId, status])
  @@index([workspaceId, priority])
  @@index([workspaceId, nextFollowUpAt])
  @@map("leads")
}

model LeadActivity {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  leadId        String   @map("lead_id")
  type          String   // 'note' | 'call' | 'email' | 'meeting'
  content       String
  metadata      Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  lead          Lead @relation(fields: [leadId], references: [id], onDelete: CASCADE)

  @@index([leadId, createdAt])
  @@map("lead_activities")
}

model LeadEvent {
  id            String   @id @default(dbgenerated("gen_random_ulid()")) @db.VarChar(26)
  leadId        String   @map("lead_id")
  eventType     String   @map("event_type")  // 'status_changed' | 'message_sent' | ...
  fromValue     String?  @map("from_value")
  toValue       String?  @map("to_value")
  metadata      Json     @default("{}")
  createdAt     DateTime @default(now()) @map("created_at")

  lead          Lead @relation(fields: [leadId], references: [id], onDelete: CASCADE)

  @@index([leadId, createdAt])
  @@index([eventType, createdAt])
  @@map("lead_events")
}

// ============================================================
// ENUMS
// ============================================================

enum Plan {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

enum UserRole {
  OWNER
  ADMIN
  MEMBER
}

enum IntegrationStatus {
  DISCONNECTED
  CONNECTED
  ERROR
}

enum AnalysisStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  FAILED
  SKIPPED
}

enum LeadSource {
  PROSPECTING
  MANUAL
  IMPORTED
  REFERRAL
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  PROPOSAL
  WON
  LOST
  ARCHIVED
}
```

### 5.3 Row-Level Security

Every table gets policies like:

```sql
-- Example: prospects table
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prospects_select_workspace"
  ON prospects FOR SELECT
  USING (
    workspace_id = (auth.uid() IS NOT NULL)
    -- Replace with: workspace_id = current_setting('app.workspace_id')::text
    -- once we wire session → SET LOCAL
  );

CREATE POLICY "prospects_insert_workspace"
  ON prospects FOR INSERT
  WITH CHECK (workspace_id = current_setting('app.workspace_id')::text);

CREATE POLICY "prospects_update_workspace"
  ON prospects FOR UPDATE
  USING (workspace_id = current_setting('app.workspace_id')::text);

CREATE POLICY "prospects_delete_workspace"
  ON prospects FOR DELETE
  USING (workspace_id = current_setting('app.workspace_id')::text);
```

The `src/lib/db/rls.ts` helper runs `SET LOCAL app.workspace_id = $1` inside every transaction.

### 5.4 Caching Strategy

- **Places API responses** are cached in `prospects.metadata.raw_places_response` so re-analysis doesn't re-fetch.
- **AI prompt/response** are cached by input hash in `ai_prompt_logs` — if the same prospect is re-analyzed with no input change, return the cached output.
- **Categories taxonomy** is fetched once at boot and stored in Postgres.
- **HTTP responses** for dashboard data use `Cache-Control: private, max-age=60, stale-while-revalidate=300`.

---

## 6. UI Architecture

### 6.1 Design Language — Linear/Notion Hybrid

The aesthetic is dense, fast, keyboard-driven. Dark mode is primary (light mode is a future option, not a launch goal). Neutral grays with a single accent color. Inter or Geist for body and UI, JetBrains Mono for code/IDs.

**Design tokens (CSS variables in `src/styles/tokens.css`):**

```css
:root {
  /* Neutral scale — cool grays */
  --c-bg-base: #0a0a0b;
  --c-bg-elevated: #131316;
  --c-bg-subtle: #1a1a1f;
  --c-bg-hover: #232329;
  --c-border-subtle: #27272e;
  --c-border-default: #34343d;
  --c-border-strong: #4a4a55;

  /* Text */
  --c-text-primary: #f4f4f5;
  --c-text-secondary: #a1a1aa;
  --c-text-tertiary: #71717a;
  --c-text-disabled: #52525b;

  /* Accent — single color (sage green, calm + professional) */
  --c-accent: #4ade80;
  --c-accent-hover: #22c55e;
  --c-accent-subtle: rgba(74, 222, 128, 0.12);
  --c-accent-border: rgba(74, 222, 128, 0.3);

  /* Semantic */
  --c-success: #4ade80;
  --c-warning: #fbbf24;
  --c-danger: #f87171;
  --c-info: #60a5fa;

  /* Typography */
  --font-sans: 'Inter', 'Geist', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Radii */
  --r-sm: 4px;
  --r-md: 6px;
  --r-lg: 8px;
  --r-xl: 12px;

  /* Spacing scale (4px base) */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;
  --s-7: 48px;

  /* Shadows — subtle, never harsh */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.5);
}
```

### 6.2 Layout System

- **App shell** (`src/app/(app)/layout.tsx`): persistent sidebar (collapsible, 240px expanded / 56px collapsed) + top bar (search, user menu, notifications).
- **Sidebar**: dashboard, prospecting, opportunities, CRM, settings. Future modules get appended below a separator.
- **Main content**: max-width 1280px, padding 32px, dense tables and panels.
- **Detail views**: master-detail pattern. List on left (40%), detail on right (60%).
- **Command palette** (cmd+k): global search + quick actions. Ships in MVP — power users expect it.

### 6.3 Component Hierarchy

```
AppShell
├── Sidebar
│   ├── SidebarItem (Dashboard)
│   ├── SidebarItem (Prospecting)
│   ├── SidebarItem (Opportunities)
│   ├── SidebarItem (CRM)
│   └── SidebarItem (Settings)
├── Topbar
│   ├── CommandPaletteTrigger
│   ├── NotificationsBell
│   └── UserMenu
└── <page content>

ProspectingPage
├── SearchForm (city + category)
├── ProspectList (table)
│   └── ProspectRow → ProspectDetail
│       ├── ProspectHeader (name, rating, score badge)
│       ├── AnalysisPanel (signals, opportunities)
│       ├── MessageEditor (draft + edit + approve)
│       └── ConvertToLeadButton
```

### 6.4 Data Flow

- **Server Components** fetch initial data.
- **Server Actions** handle mutations. No REST endpoints for the Growth module.
- **TanStack Query** used only for optimistic UI updates on top of Server Action responses.
- **Supabase Realtime** pushes analysis-completion events so the UI updates without polling.

### 6.5 Accessibility & Keyboard

- Every interactive element is reachable by Tab.
- `cmd+k` opens command palette.
- `j` / `k` navigate rows in lists.
- `Enter` opens detail.
- `e` edits message draft.
- `cmd+enter` approves and converts to lead.
- Color contrast ≥ AA. Score badges use shape + color (not color alone) for accessibility.

---

## 7. Development Phases

Each phase has a model recommendation, a goal, and a Definition of Done. Antigravity must complete each phase before starting the next. Commits land on `develop` branch via PR.

### Phase 0 — Foundation Bootstrap

**Model:** Claude Sonnet 4.5
**Why:** Scaffolding is repetitive, mechanical, low-ambiguity. Sonnet is fast and accurate for boilerplate. Opus would slow iteration without quality gain.
**Expected output:** A repo that boots, type-checks, lints, and deploys to Vercel with a green CI.

**Tasks:**
1. `pnpm create next-app` with TypeScript, Tailwind, App Router.
2. Install dependencies per §4.
3. Set up Prisma + Supabase connection. Run first migration (workspace, user, integration tables only).
4. Set up Supabase Auth (magic link + Google OAuth).
5. Set up environment variable validation (`src/lib/config/env.ts` with zod).
6. Set up pino logger, Sentry instrumentation, request ID middleware.
7. Set up Husky pre-commit (lint + typecheck).
8. Set up GitHub Actions CI: lint, typecheck, vitest, build.
9. Create the design tokens CSS file. Configure shadcn/ui theme.
10. Create the app shell layout with sidebar + topbar (empty pages).
11. Deploy to Vercel staging. Verify `/login` works end-to-end.

**Definition of Done:**
- `pnpm dev` boots without warnings.
- `pnpm build` succeeds.
- CI is green on `main`.
- Staging URL loads, user can log in via magic link, lands on empty dashboard.
- Pre-commit hook blocks commits with type errors.

---

### Phase 1 — AI Router & Adapters

**Model:** Claude Opus 4
**Why:** The AI router is the most important abstraction in the codebase. Once call sites depend on it, changing the interface is expensive. Opus reasons more carefully about interface design, error modes, and edge cases. The cost is justified.
**Expected output:** A working `aiRouter.complete()` with one provider (Anthropic), one task (`prospect_analysis`), full prompt logging, cost tracking, and a retry/fallback layer.

**Tasks:**
1. Define the `Provider` interface (`src/lib/ai/providers/types.ts`).
2. Implement `AnthropicProvider` (`src/lib/ai/providers/anthropic.ts`) — wraps the Anthropic SDK, handles retries, parses responses.
3. Define the `Task` registry. Each task is a file in `src/lib/ai/tasks/` exporting `{ taskName, defaultModel, promptTemplate, outputSchema, fallbackModel? }`.
4. Implement `aiRouter.complete({ task, input, modelOverride? })`:
   - Resolves the task definition.
   - Picks model (override → task default → Sonnet).
   - Renders the prompt template with input.
   - Calls the provider.
   - Validates output against `outputSchema` (zod). On failure, retries once with a stricter prompt, then logs and surfaces a typed error.
   - Persists prompt + response to `ai_prompt_logs`.
   - Records cost to `ai_cost_records`.
   - Returns typed output.
5. Implement cost tracker (per-model $/token table, refreshed from Anthropic's pricing endpoint monthly).
6. Implement caching by input hash (return cached output if input unchanged and cache age < 7 days).
7. Write the v1 prompt for `prospect_analysis` (multi-shot, with explicit JSON output schema).
8. Wire `aiRouter` into a test route `/api/ai/test` (auth-required) that runs an end-to-end analysis on a mock prospect.
9. Write unit tests for the router: cache hit, cache miss, retry on validation failure, fallback to Opus, error propagation.

**Definition of Done:**
- Calling `aiRouter.complete({ task: 'prospect_analysis', input: mockProspect })` returns a typed, validated result.
- Cost is recorded.
- Prompt is logged.
- Cache hit on second identical call.
- Tests pass.
- ADR-0003 (AI Router Abstraction) is written.

---

### Phase 2 — Google Places Adapter & Categories

**Model:** Claude Sonnet 4.5
**Why:** Mechanical work — API client, type mapping, caching. Sonnet is more than capable.
**Expected output:** `placesAdapter.search({ city, category })` returns normalized prospects. Categories are seeded. Idempotent upsert into `prospects`.

**Tasks:**
1. Define `PlacesAdapter` interface and `GooglePlacesAdapter` implementation.
2. Implement `search({ city, category })`:
   - Calls Places API Text Search (New) with `<category> in <city>`.
   - Paginates through all results (up to 20 per page, max 60 total — configurable).
   - For each result, fetches Place Details (New) — name, address, phone, website, rating, price_level, business_status, opening_hours, photos metadata.
   - Maps Google's response to our `Prospect` shape.
3. Implement idempotent upsert in `ProspectingRepository.upsertMany()` — uses `placeId` as the unique key per workspace.
4. Implement a `sync-places-categories` script that pulls Google's taxonomy of place types and seeds `business_categories`.
5. Build a small admin-only page `/admin/categories` to manage category mappings (label → Google place type).
6. Write integration tests against Google's sandbox (recorded responses via nock/MSW).
7. Implement rate-limit handling (Google allows 100 QPS for Pro tier; we queue with 10 RPS to be safe).

**Definition of Done:**
- Searching "Barbershops in Madrid" persists 20–60 prospects.
- Re-running the same search returns the same prospects without duplicates (idempotent).
- Categories table is seeded with at least 50 categories.
- Tests cover happy path, pagination, rate-limit retry, and API error.

---

### Phase 3 — Prospecting UI & AI Analysis Flow

**Model:** Claude Opus 4 for analysis pipeline, Claude Sonnet 4.5 for UI
**Why:** The prospecting page is the heart of the MVP. UX quality matters here. The AI analysis prompt itself is also high-stakes — quality of output drives the whole product. Opus for both.
**Expected output:** A `/growth/prospecting` page where the user can search, see prospects, trigger analysis, view scores and opportunities, and review message drafts.

**Tasks:**
1. Build `SearchForm` (city autocomplete + category dropdown).
2. Build `ProspectList` (table with name, category, rating, score badge, status).
3. Build `ProspectDetail` panel (right side) with tabs: Overview, Analysis, Message.
4. Wire `analyzeProspect` Server Action: calls `aiRouter.complete({ task: 'prospect_analysis' })`, persists result, emits Realtime event.
5. Build `AnalysisPanel` showing signals (chips) and opportunities (cards with severity).
6. Build `ScoreBadge` component (0–100, color-coded with shape for accessibility).
7. Implement batch analysis ("Analyze all 50 results") with progress bar and per-prospect status.
8. Wire `message_polish` Opus task for prospects with score ≥ 80.
9. Build `MessageEditor` — editable textarea, char count, "Regenerate" button (calls Opus), "Approve" button.
10. Implement Realtime subscription so the list updates live as analyses complete.

**Definition of Done:**
- User can search → see 20–60 prospects → click "Analyze all" → watch scores populate in real time → click a prospect → see analysis + draft message → edit the message → click "Approve".
- All Server Actions are validated with zod.
- All AI calls go through the router (verify by searching the codebase for direct SDK imports — should be zero outside `src/lib/ai/providers/`).

---

### Phase 4 — CRM & Lead Conversion

**Model:** Claude Sonnet 4.5
**Why:** CRUD-heavy, well-bounded. Sonnet is plenty.
**Expected output:** A `/crm` page with leads list, lead detail, status changes, activity log, and a "Convert to Lead" action from prospects.

**Tasks:**
1. Build `LeadList` (TanStack Table, filter by status, sort by priority/nextFollowUp).
2. Build `LeadDetail` (contact info, source prospect link, message, status timeline, activity feed).
3. Implement `convertToLead` Server Action: creates `Lead`, sets `Prospect.convertedToLeadId`, emits `LeadEvent`.
4. Implement status change action with optimistic UI.
5. Implement activity logging (notes, calls, emails — manual entry for MVP).
6. Build the `/growth/dashboard` page with: KPI cards (prospects analyzed, leads created, leads won, conversion rate), recent leads table, simple pipeline bar chart.
7. Build `/settings` page: profile, integrations (Gmail OAuth connect button — non-functional stub in this phase, wired in Phase 5), AI config (read-only display of which model is used for which task).

**Definition of Done:**
- Approving a prospect creates a lead visible in CRM.
- Lead statuses can be changed; events are logged.
- Dashboard shows correct KPIs (test fixtures cover edge cases: 0 prospects, 0 leads, etc.).
- Settings page renders without errors.

---

### Phase 5 — Outreach & Email Integration

**Model:** Claude Opus 4 for OAuth security review, Claude Sonnet 4.5 for the rest
**Why:** OAuth token storage and email sending are security-sensitive. Opus reviews the implementation; Sonnet executes.
**Expected output:** User can connect Gmail, send the approved message via email, copy to clipboard, or open WhatsApp click-to-chat.

**Tasks:**
1. Implement OAuth flow using `arctic` (Gmail, with `gmail.send` scope).
2. Store tokens encrypted (AES-256-GCM) in `integrations.metadata`.
3. Implement `EmailProvider.send({ to, subject, body })` interface + `GmailProvider`.
4. Build "Send Email" button on lead detail — calls the provider, logs to `lead_events`, updates `outreachSentAt`.
5. Build "Copy to Clipboard" button (writes final message to clipboard, logs event).
6. Build "Open WhatsApp" button (generates `wa.me/<phone>?text=<urlencoded-message>` link, logs event).
7. Build email template (React Email) so messages render nicely.
8. Security review with Opus: token refresh flow, scope minimization, error handling, audit logging.
9. Write integration tests with mocked Gmail API.

**Definition of Done:**
- User can connect Gmail, see connection status in settings.
- User can send an email from a lead — it arrives (test against a sandbox inbox).
- All three outreach channels log events with timestamps.
- Security review passes (no secrets logged, tokens encrypted at rest, scopes minimal).

---

### Phase 6 — Hardening, Observability, Documentation

**Model:** Claude Opus 4
**Why:** Final hardening phase. Opus catches subtle bugs and writes better documentation.
**Expected output:** Production-ready. Docs complete. Runbooks written. E2E tests green. Sentry clean on staging for 7 days.

**Tasks:**
1. Write E2E Playwright tests for the full flow: login → search → analyze → convert → send.
2. Add structured logging to every Server Action (input hash, duration, success/error).
3. Add Sentry release tracking + source maps.
4. Write `docs/architecture.md`, `docs/runbooks/*.md`, `docs/glossary.md`.
5. Write ADRs for every major decision (target: 10–15 ADRs).
6. Write `README.md` with setup instructions for a new developer.
7. Run a security audit (`pnpm audit`, manual review of auth flows).
8. Performance audit: Lighthouse on key pages, optimize slow queries, add indexes where EXPLAIN suggests.
9. Write the deployment runbook (how to deploy, rollback, rotate secrets).
10. Set up a staging → production promotion flow (Vercel previews → promote).

**Definition of Done:**
- All E2E tests pass on staging.
- Lighthouse score ≥ 90 on all four sections for `/dashboard` and `/growth/prospecting`.
- Zero high-severity vulnerabilities in `pnpm audit`.
- README + runbooks sufficient for a new developer to onboard in <2 hours.
- Staging has run for 7 days with zero unhandled errors in Sentry.

---

## 8. Milestones

| Milestone | Phase(s) | Target Outcome | Demo-able? |
|---|---|---|---|
| **M1 — Bootable Foundation** | P0 | App boots, auth works, deploy pipeline green | Yes — login flow |
| **M2 — AI Router Live** | P1 | `/api/ai/test` returns an analyzed mock prospect | Yes — curl demo |
| **M3 — First Real Prospects** | P2 | "Barbershops in Madrid" returns 20+ prospects | Yes — search demo |
| **M4 — End-to-End Prospecting** | P3 | Search → analyze → view scores + drafts | Yes — full prospecting demo |
| **M5 — Lead Conversion** | P4 | Approve prospect → see in CRM → change status | Yes — CRM demo |
| **M6 — Outreach Working** | P5 | Send a real email from a lead | Yes — outreach demo |
| **M7 — Production Launch** | P6 | Deployed to prod, docs complete, 7 days stable | Yes — production URL |

Each milestone is a PR merge gate. No milestone is "mostly done" — it's either done or not started.

---

## 9. Rules Antigravity Must Follow

These rules are non-negotiable. Antigravity must check each one before declaring any phase complete.

### 9.1 Scope Rules

1. **Build only the Foundation + AXIOM Growth MVP.** Do not implement Finance, AI Workforce, Projects, Trading, Knowledge Base, Automation, or any other future module.
2. **Do not stub future modules.** No empty route files, no placeholder pages, no "coming soon" UI. The codebase contains only what ships.
3. **Leave architectural hooks, not implementations.** The `workspace_id` column, the `ai_router` abstraction, the `adapter` pattern — these are hooks. Future modules plug into them; they do not exist as stubs.
4. **No speculative abstractions.** Don't build a plugin system for one plugin. Don't build an event bus with no subscribers. Build the abstraction when the second consumer appears, not before — except where this spec explicitly mandates it (ai_router, adapters, workspace_id).

### 9.2 Code Rules

5. **TypeScript strict mode.** `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`. No `any` without an inline justification comment.
6. **No `console.log` in production paths.** Use the pino logger. `console.error` allowed only in error.tsx boundaries.
7. **No direct DB access outside repositories.** Every table has a repository module. UI and services call repositories, never `prisma.client.table.findMany()`.
8. **No direct LLM SDK calls outside `src/lib/ai/providers/`.** Enforced by an ESLint rule.
9. **No direct external API calls outside `src/lib/adapters/`.** Enforced by an ESLint rule.
10. **Every mutation is a Server Action with zod validation.** No client-side mutations.
11. **Every API route requires auth.** No public endpoints except `/api/webhooks/*` (which validate signatures).
12. **Every error is typed.** Use `AppError` subclasses. No `throw new Error('foo')`.
13. **No magic strings.** Enums, constants, or string literal types.
14. **No silent failures.** `catch` blocks must either log, rethrow, or convert to a typed error. Never swallow.
15. **No `any` casts to silence the compiler.** Fix the type or write a guarded assertion.

### 9.3 Security Rules

16. **RLS on every table.** No exceptions. Verified by a test that tries to read another workspace's data and asserts it fails.
17. **API keys stored encrypted.** AES-256-GCM. Decryption only in the adapter at call time.
18. **OAuth tokens scoped minimally.** Gmail scope is `gmail.send` only, not `gmail.modify` or full access.
19. **No secrets in client bundles.** Use `NEXT_PUBLIC_*` only for truly public values. Server-only env vars never appear in client code.
20. **CSRF protection on all mutations.** Next.js Server Actions have this built-in; do not bypass.
21. **Rate limiting on auth endpoints.** 5 attempts per IP per 15 minutes for magic link, 10 per IP per hour for OAuth.
22. **Input validation on every boundary.** zod at every Server Action and route handler entry.

### 9.4 AI Rules

23. **Every AI call goes through `aiRouter`.** No exceptions.
24. **Every AI prompt is logged.** Input, output, model, duration, tokens, cost.
25. **Every AI output is validated** against a zod schema. Invalid output triggers a retry, then a typed error.
26. **No PII leaves the system** in AI prompts unless explicitly approved. Prospects' phone numbers and emails are NOT sent to the LLM unless the message_polish task explicitly requires them.
27. **Cost is tracked per workspace.** Dashboard shows daily/weekly/monthly spend.
28. **Models are configurable per task** via the `tasks/` registry. Changing the model for a task is a one-line edit, not a code change.

### 9.5 Process Rules

29. **One commit per logical change.** No "fix typo + refactor + new feature" mega-commits.
30. **Conventional Commits only.** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`.
31. **Every PR has a description** explaining what changed, why, and how to test.
32. **Every PR links to a phase + milestone.**
33. **No force-push to `main` or `develop`.** Only to feature branches.
34. **No direct commits to `main` or `develop`.** PR only.
35. **Rebase, don't merge, when possible.** Linear history preferred.

---

## 10. Coding Standards

### 10.1 TypeScript

- `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`.
- Prefer `type` for unions and intersections, `interface` for object shapes that may be extended.
- Use `unknown` instead of `any` for unvalidated external data.
- Use `Result<T, E>` (defined in `src/lib/utils/result.ts`) for fallible operations, not throw/catch in business logic.
- Never use `!` (non-null assertion) outside tests. Use a guarded assertion: `assert(value, 'expected value')`.

### 10.2 Naming

- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for React components.
- Variables/functions: `camelCase`.
- Types/interfaces: `PascalCase`.
- Constants: `SCREAMING_SNAKE_CASE`.
- Database columns: `snake_case`.
- Database tables: `snake_case` plural.
- Enums: `PascalCase` for type, `SCREAMING_SNAKE_CASE` for values.

### 10.3 React

- Function components only. No class components.
- Server Components by default. `'use client'` only when interactivity is required.
- Hooks: `use` prefix, custom hooks in `hooks/use-*.ts`.
- Props: typed with an interface, named `ComponentProps`.
- No default exports for components. Named exports only.
- Composition over configuration. No props with 10+ keys.

### 10.4 Styling

- Tailwind classes only. No CSS modules, no styled-components, no inline styles (except dynamic values).
- Design tokens referenced via CSS variables, not hardcoded Tailwind colors: `bg-[var(--c-bg-elevated)]` or via a Tailwind plugin that maps tokens to utilities.
- shadcn/ui components customized to match the Linear/Notion aesthetic — denser padding, subtler borders.
- Dark mode is the default. Light mode is a non-goal for MVP.

### 10.5 API Design

- Server Actions named `verbNoun`: `analyzeProspect`, `convertToLead`, `sendEmail`.
- Return `Result<T, AppError>` from every Server Action.
- Zod schemas in `schema.ts` files co-located with the action.
- Pagination: cursor-based for lists (`{ cursor: string | null, limit: number }`).
- Errors: typed, with stable error codes. UI can switch on `error.code`.

### 10.6 Database

- Every query goes through a repository method. No raw Prisma calls in services or actions.
- Transactions used for multi-table writes. Helper: `withTransaction(async (tx) => ...)`.
- `SELECT` explicitly lists columns; no `findMany()` returning full rows when only a subset is needed.
- N+1 queries are forbidden. Detected by a test that fails when query count exceeds a threshold.

### 10.7 File Length

- Components: ≤ 200 lines. Split if longer.
- Server Actions: ≤ 100 lines. Move logic to services.
- Services: ≤ 300 lines. Split by responsibility.
- Repositories: ≤ 200 lines per table.

### 10.8 Comments

- Comments explain *why*, not *what*. The code already says what.
- JSDoc on every exported function: `@param`, `@returns`, `@throws`.
- TODOs must have an owner and a ticket reference: `// TODO(@alice, AX-123): ...`.

---

## 11. Git Workflow

### 11.1 Branch Model

- `main` — production. Always deployable. Protected.
- `develop` — staging. Always deployable to staging. Protected.
- `feat/<scope>-<short-desc>` — feature branches. e.g. `feat/growth-prospecting-search`.
- `fix/<scope>-<short-desc>` — bug fixes.
- `chore/<short-desc>` — tooling, deps, config.
- `docs/<short-desc>` — documentation only.

### 11.2 Commit Format — Conventional Commits

```
<type>(<scope>): <subject>

<body — why, what changed, how to test>

<footer — breaking changes, ticket refs>
```

- `type`: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`.
- `scope`: `growth`, `crm`, `ai`, `db`, `auth`, `ui`, `infra`, etc.
- `subject`: imperative mood, lowercase, no period, ≤ 72 chars.
- `body`: wrapped at 100 chars, explains *why*.

**Examples:**
```
feat(growth): add prospecting search form

Implements the city + category search form on /growth/prospecting.
Validates input with zod, debounces city autocomplete, and shows
loading state during search.

How to test:
- Visit /growth/prospecting
- Search "Barbershops" in "Madrid"
- Verify list populates

Refs: AX-101
```

### 11.3 PR Rules

- One PR per feature/fix. No bundled changes.
- PR title = first commit's subject (or squash-merge title).
- PR description template:
  ```markdown
  ## What
  <what changed>

  ## Why
  <rationale>

  ## How to test
  <steps>

  ## Phase / Milestone
  Phase X — M Y

  ## Checklist
  - [ ] Tests added
  - [ ] Docs updated
  - [ ] No console.log
  - [ ] Types pass
  - [ ] Lint passes
  ```
- Reviews: at least one approval required. Author does not self-merge.
- CI must be green.
- Squash-merge to `develop`. Merge-commit from `develop` to `main` for releases.

### 11.4 Release Flow

- Releases are tagged: `v0.1.0`, `v0.2.0`, etc.
- Release notes generated from PR titles since last release.
- Deploy to staging on every merge to `develop`.
- Deploy to production on every merge to `main` (manual promote in Vercel).

### 11.5 Hotfix Flow

- Branch from `main`: `hotfix/<short-desc>`.
- PR to `main` and `develop` (cherry-pick or merge).
- Tag a patch release: `v0.1.1`.

---

## 12. Documentation Rules

### 12.1 Documentation Tiers

| Tier | Location | Audience | Maintained By |
|---|---|---|---|
| **Tier 1 — README** | `README.md` | New developers | Lead Architect |
| **Tier 2 — Architecture** | `docs/architecture.md` + `docs/adr/*` | Engineers, future contributors | Every PR that touches architecture |
| **Tier 3 — API** | `docs/api/*` (generated from zod) | Frontend engineers | Auto-generated on every PR |
| **Tier 4 — Runbooks** | `docs/runbooks/*` | On-call operators | Every new incident or operational learning |
| **Tier 5 — Code** | JSDoc comments | Engineers reading code | Every PR |
| **Tier 6 — User** | In-app tooltips + `/help` page | End users | Phase 6 |

### 12.2 ADR Format

```markdown
# ADR-NNNN: <Title>

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXXX

## Context
<Why is this decision needed? What forces are at play?>

## Decision
<What we decided.>

## Consequences
- Positive: ...
- Negative: ...
- Neutral: ...

## Alternatives Considered
- Option A: <why rejected>
- Option B: <why rejected>

## References
- Links to relevant articles, discussions, prior ADRs.
```

ADRs are numbered sequentially. Once accepted, they are immutable — supersession happens via a new ADR.

### 12.3 README Requirements

The root `README.md` must contain:
1. Project overview (3 paragraphs).
2. Quick start (clone, install, env, migrate, seed, dev).
3. Architecture summary (one diagram + 200 words).
4. Folder structure overview.
5. Development commands (`dev`, `build`, `test`, `lint`, `migrate`, `seed`).
6. Deployment summary.
7. Links to detailed docs.

### 12.4 Runbook Requirements

Every runbook answers:
1. What does this system do?
2. How do I know it's healthy?
3. How do I know it's broken?
4. What do I do when it's broken?
5. Who owns it?

Initial runbooks required: `deploy.md`, `rollback.md`, `rotate-secrets.md`, `database-migration.md`, `ai-cost-monitoring.md`, `google-places-quota.md`.

### 12.5 Code Documentation

- Every exported function has JSDoc.
- Every non-trivial type has a comment explaining what it represents.
- Every ADR-level decision (auth strategy, RLS policy, AI router) is referenced in code comments pointing to the ADR.
- Prompts in `src/lib/ai/prompts/` are versioned markdown files with a header explaining the task, expected input, expected output, and version history.

---

## 13. Definition of Done

A task, PR, or phase is "Done" only when ALL of the following are true:

### 13.1 Code

- [ ] TypeScript compiles with `strict: true`, no errors.
- [ ] ESLint passes with zero warnings.
- [ ] Prettier formatted.
- [ ] No `console.log`, no `any` (without justification comment).
- [ ] No TODOs without an owner + ticket reference.

### 13.2 Tests

- [ ] Unit tests for every new function with logic.
- [ ] Integration tests for every new repository method.
- [ ] E2E test for every new user-facing flow.
- [ ] Coverage ≥ 80% for new code (statements + branches).
- [ ] All tests pass on CI.

### 13.3 Security

- [ ] RLS policies written and tested.
- [ ] Zod validation on every input boundary.
- [ ] No secrets in client code.
- [ ] `pnpm audit` shows no high-severity vulnerabilities.

### 13.4 Performance

- [ ] No N+1 queries (verified by query-count test).
- [ ] Lighthouse score ≥ 90 on affected pages.
- [ ] API responses < 500ms p95 (excluding external API calls).

### 13.5 Documentation

- [ ] JSDoc on new exports.
- [ ] README updated if setup steps changed.
- [ ] ADR written for any architectural decision.
- [ ] Runbook updated if operational behavior changed.

### 13.6 Observability

- [ ] Structured logs on every Server Action.
- [ ] Sentry events on every caught error.
- [ ] AI calls logged with cost.

### 13.7 Process

- [ ] PR description complete.
- [ ] Phase + milestone tagged.
- [ ] Reviewer approved.
- [ ] CI green.
- [ ] Merged via squash-merge to `develop`.

### 13.8 Phase-Level DoD (in addition to above)

- [ ] All tasks in the phase's task list are complete.
- [ ] Phase milestone demo-able.
- [ ] No open TODOs from the phase.
- [ ] Staging deployment successful.

---

## 14. Testing Strategy

### 14.1 Test Pyramid

```
            /\
           /  \         E2E (Playwright) — ~20 tests
          /----\        Critical user flows only
         /      \
        /--------\     Integration (Vitest + Test DB) — ~200 tests
       /          \    Repositories, services, Server Actions
      /------------\
     /              \ Unit (Vitest) — ~1000 tests
    /----------------\ Pure functions, zod schemas, utils
```

### 14.2 Tools

| Layer | Tool | Notes |
|---|---|---|
| Unit | Vitest | Fast, watch mode, JSDoc coverage. |
| Integration | Vitest + Supabase local DB | Real Postgres via `supabase start` (Docker). |
| E2E | Playwright | Cross-browser, runs on CI. |
| Mocking | MSW (Mock Service Worker) | For HTTP mocking in integration tests. |
| Fixtures | `tests/fixtures/` | Reusable test data. |
| Coverage | c8 via Vitest | Reports to CI; fails build if <80% on changed files. |

### 14.3 What to Test

**Unit tests:**
- All utility functions.
- Zod schemas (valid + invalid cases).
- AI router (cache hit/miss, retry, fallback, error).
- Adapter request/response mapping.
- Result type (`ok`, `err`, `map`).

**Integration tests:**
- Repository methods (real Postgres, real RLS).
- Server Actions (with mocked adapters).
- AI tasks (with mocked Anthropic responses).
- Places adapter (with MSW-mocked Google API).

**E2E tests:**
- Login → dashboard.
- Search prospects → analyze → view detail → edit message → approve → see in CRM.
- Connect Gmail (mocked OAuth) → send email → verify event logged.
- Lead status change → event logged → dashboard updates.

### 14.4 What Not to Test

- Third-party SDK internals.
- Prisma itself.
- Trivial getters/setters.
- UI rendering of static text (covered by E2E).

### 14.5 Test Database

- Use `supabase start` for a local Docker Postgres.
- Before each integration test suite: run migrations, seed fixtures.
- After each test: truncate tables (faster than re-migrating).
- Tests run in parallel with separate schemas (`test_<random>`) to avoid conflicts.

### 14.6 CI Test Pipeline

```
pnpm install
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:integration  # uses local Supabase
pnpm test:e2e          # against staging preview deployment
pnpm build
```

CI fails on any red step. Coverage report uploaded as an artifact.

### 14.7 AI Output Testing

- Every AI task has golden-file tests: known input → expected output shape (not exact text — AI is non-deterministic).
- Tests verify the zod schema passes and key fields are present.
- A weekly CI job re-runs golden-file tests against the latest model versions and alerts if outputs drift.

---

## 15. Future Scalability Considerations

This section guides future architects. Antigravity does NOT implement these — but every MVP decision must not block them.

### 15.1 Multi-Tenant Evolution

- `workspace_id` is on every table today. Multi-tenancy is a matter of (a) allowing users to join multiple workspaces, (b) updating RLS to scope by `current_setting('app.workspace_id')`, (c) adding a workspace switcher in the UI.
- No code outside `src/lib/auth/` and `src/lib/db/rls.ts` needs to change.

### 15.2 Module Plug-in Architecture

- Future modules (Finance, Projects, etc.) live at `src/modules/<name>/`.
- They register their sidebar items, settings sections, and permissions via a manifest file: `src/modules/<name>/manifest.ts`.
- The app shell reads manifests at build time and renders accordingly.
- No module imports another module's code. Cross-module data flows through the database.

### 15.3 Background Job Queue

- MVP uses inline async + Next.js cron. The interface (`enqueueJob`) is abstracted.
- Swap to Inngest / Trigger.dev / a self-hosted BullMQ when:
  - Job volume > 100/min sustained.
  - Jobs need retry policies, dead-letter queues, or scheduling beyond cron.
- The migration is one new adapter; call sites unchanged.

### 15.4 AI Provider Expansion

- `aiRouter` accepts a `provider` field. Today it's always Anthropic.
- Adding OpenAI / Mistral / a local model is one new file in `providers/`.
- Tasks can override the provider per task: `prospect_analysis` might stay on Anthropic, `summarize_note` might use a cheaper local model.

### 15.5 Geographic Scaling

- Supabase is single-region initially. When latency matters in a second region:
  - Promote to multi-region read replicas (Supabase supports this).
  - Move writes through a single primary; reads from local replica.
  - No app code changes.

### 15.6 Data Volume Scaling

- `prospects` and `ai_prompt_logs` will grow fastest.
- Strategy: partition `ai_prompt_logs` by month once it exceeds 10M rows.
- Archive prospects soft-deleted > 12 months to a cold table.
- Use Postgres native partitioning (declarative).

### 15.7 API Evolution

- MVP uses Server Actions only. When a public REST/GraphQL API is needed:
  - Add a `src/app/api/v1/*` route layer.
  - Reuse the same services and repositories.
  - Add API key auth alongside session auth.
- The repository pattern means the API is a thin transport layer over existing logic.

### 15.8 Mobile

- MVP is desktop-first. Mobile-responsive but not mobile-optimized.
- Future mobile app: React Native (Expo), sharing the same Server Actions + API routes.
- The data layer is already mobile-friendly (no client-side DB access).

### 15.9 Real-time

- Supabase Realtime for prospect-analysis completion and lead status changes.
- When more real-time features land (collaborative editing, presence), evaluate Liveblocks or a self-hosted WS gateway.

### 15.10 Analytics & BI

- Dashboard MVP uses simple Recharts.
- When a real BI module lands: warehouse events to a separate analytics Postgres (or ClickHouse for scale), query from there.
- Don't pollute the transactional DB with analytics queries.

### 15.11 Compliance

- MVP is single-user, low compliance burden. When multi-tenant + EU customers:
  - GDPR: data export, data deletion, audit log of access.
  - SOC 2: structured audit logs, access reviews.
- The `metadata jsonb` column on every table makes adding audit fields a config change, not a migration.

### 15.12 Trade-offs Documented

Every future-scalability decision above is a trade-off. The ADR captures the choice, the alternative, and the cost of switching. Future architects consult ADRs before reversing any decision.

---

## 16. Missing Pieces (Architect's Additions)

The original brief listed 15 items. These are the things I would be remiss not to include.

### 16.1 Error Budget & SLO

- Define SLOs from day one: 99.5% uptime, p95 API < 500ms, AI call success > 99%.
- Track error budget. When budget is burned, freeze feature work and pay down debt.
- Dashboard visible to the user (in `/settings/health`) once multi-user lands.

### 16.2 Cost Monitoring

- AI cost per workspace, per task, per day — visible in settings.
- Alert when daily spend exceeds a configurable threshold (default $10/day).
- Hard cap at $100/day per workspace (configurable) — AI calls fail-open with a friendly error.

### 16.3 Disaster Recovery

- Daily Supabase backups (built-in).
- Weekly restore test to a staging DB — automated.
- RPO: 24 hours. RTO: 4 hours.
- Runbook: `docs/runbooks/disaster-recovery.md`.

### 16.4 Privacy by Design

- Prospects' PII (phone, email) is flagged in the schema.
- AI prompts strip PII unless the task explicitly requires it.
- Data retention: prospects soft-deleted > 90 days are hard-deleted by a weekly cron.
- Right-to-be-forgotten: a function `deleteWorkspaceData(workspaceId)` that cascades.

### 16.5 Onboarding

- First-run experience: a guided tour of the four sections.
- Sample data: a "Load demo prospects" button that seeds 5 mock prospects with analyses.
- Empty states: every list/panel has a clear empty state with a CTA.

### 16.6 Telemetry

- Product analytics (PostHog self-hosted): page views, feature usage, funnel tracking.
- Anonymized by default. User can opt out in settings.
- No PII in telemetry.

### 16.7 Internationalization

- MVP is English-only.
- Strings extracted via `next-intl` from day one (no inline strings).
- Adding Spanish / Portuguese / etc. is a translation file, not a refactor.

### 16.8 Accessibility

- WCAG 2.1 AA from day one.
- Keyboard navigation tested in every PR.
- Screen reader testing in Phase 6.
- axe-core in CI.

### 16.9 Performance Budget

- JS bundle: ≤ 200KB initial, ≤ 500KB per route.
- LCP < 2.5s on dashboard.
- INP < 200ms on prospect list.
- Bundle analyzed in CI; fails if budget exceeded.

### 16.10 Dependency Hygiene

- `pnpm audit` in CI.
- Renovate bot for dependency updates (auto-merge patch versions).
- No new dependency without justification in the PR.
- Quarterly review of dependencies; remove unused.

### 16.11 Secret Management

- Local: `.env.local` (gitignored).
- Staging/Prod: Vercel environment variables (encrypted at rest).
- Rotation: every 90 days for API keys. Runbook: `rotate-secrets.md`.
- No secrets in code, ever. Enforced by a pre-commit secret scanner (`gitleaks`).

### 16.12 Incident Response

- Severity levels: SEV1 (data loss / outage), SEV2 (degraded core flow), SEV3 (bug, workaround exists).
- SEV1: page on-call. SEV2: fix within 24h. SEV3: fix in next sprint.
- Post-mortem for every SEV1/SEV2. Blameless. Published in `docs/postmortems/`.

### 16.13 Anti-Spam Safeguards (Critical)

- The MVP is NOT bulk outreach. Per the brief, quality over quantity.
- Hard limits: max 20 prospects analyzed per search, max 50 leads created per day, max 10 emails sent per day (configurable in settings).
- Soft cooldown: after sending 5 emails in an hour, a 1-hour cooldown triggers.
- All sends require explicit human action. No "send all" button. Ever.
- Future automation must go through a separate "Automation" module with its own review gates — not bolted onto the MVP.

### 16.14 Domain-Driven Boundaries

- Each module owns its database tables. The Growth module owns `prospects`, `leads`, `lead_activities`, `lead_events`, `business_categories`, `cities`.
- Cross-module references use IDs only, never joins. A future Finance module referencing a Lead does so by `lead_id`, not by joining the `leads` table.
- This is enforced by a custom ESLint rule on Prisma schema: cross-module relations are forbidden.

### 16.15 The "Second Module" Drill

To prove the architecture is sound, Phase 6 includes a drill: spec out (but do not implement) a hypothetical second module (say, "AXIOM Projects"). If the architecture accommodates it without changes to Foundation code, the Foundation is sound. If not, fix the Foundation before shipping.

---

## 17. Master Prompt for Antigravity

> Copy everything below this line into Antigravity.

---

# MASTER PROMPT — AXIOM FOUNDATION + AXIOM GROWTH MVP

You are Antigravity. You are building **AXIOM**, a personal and business operating system that will eventually contain twelve or more modules. **Right now you are building only two things:**

1. The **Foundation** — the shared platform every future module sits on.
2. **AXIOM Growth** — the first MVP module. A prospecting tool that finds businesses, analyzes them with AI, scores them, detects opportunities, drafts personalized sales messages, and converts approved prospects into CRM leads.

You are NOT building Finance, AI Workforce, Project Management, Trading, Knowledge Base, Automation, Personal OS, Analytics, BI, or any other future module. They do not exist in this codebase. The architecture must be ready for them — but they are not built.

---

## Non-Negotiable Principles

1. **Build only Foundation + AXIOM Growth.** No future modules, no stubs, no "coming soon" pages.
2. **Optimize for the next decade, not the next demo.** Every decision must be defensible in an Architecture Decision Record.
3. **Human review is sacred.** The MVP is NOT bulk outreach. Every message requires explicit human action before it leaves the system.
4. **Type safety end-to-end.** Prisma → Zod → TypeScript. No `any`. No unvalidated boundaries.
5. **AI behind a router.** No direct LLM SDK calls outside `src/lib/ai/providers/`.
6. **External APIs behind adapters.** No direct external API calls outside `src/lib/adapters/`.
7. **Security by construction.** RLS on every table. Auth on every route. Encryption on every secret.
8. **Observability from day one.** Structured logs, AI audit logs, cost tracking, Sentry.
9. **Tests are not optional.** 80% coverage on changed code. E2E for every user flow.
10. **Documentation is not optional.** README, ADRs, runbooks, JSDoc on every export.

---

## Stack (Locked)

- **Framework:** Next.js 16 (App Router, RSC default, Server Actions for mutations)
- **Language:** TypeScript 5.7+, `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`
- **Database:** Supabase Postgres + Supabase Auth + Supabase Realtime
- **ORM:** Prisma 6+
- **Styling:** Tailwind CSS 4 + shadcn/ui, Linear/Notion hybrid aesthetic, dark mode primary
- **AI:** Anthropic SDK behind an internal `aiRouter` (Sonnet 4.5 default, Opus 4 for quality gates)
- **Data source:** Google Places API (New)
- **Outreach:** Manual review + copy + Gmail OAuth (scope: `gmail.send` only)
- **Deploy:** Vercel + Supabase
- **Package manager:** pnpm
- **Tests:** Vitest (unit + integration) + Playwright (E2E)
- **Linting:** ESLint + Prettier, Husky pre-commit
- **Observability:** pino + Sentry
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table 8
- **Charts:** Recharts (dashboard MVP only)
- **Email:** React Email templates

---

## Folder Structure (Strict)

```
axiom/
├── .github/workflows/         # CI: lint, typecheck, test, build, codeql
├── docs/
│   ├── architecture.md
│   ├── adr/                   # Architecture Decision Records (numbered)
│   ├── api/                   # auto-generated from zod schemas
│   ├── runbooks/              # deploy, rollback, rotate-secrets, etc.
│   └── glossary.md
├── prisma/
│   ├── schema.prisma          # single source of truth
│   ├── migrations/            # immutable once merged
│   └── seed.ts                # idempotent
├── public/
├── scripts/
│   ├── check-env.ts
│   ├── seed-categories.ts
│   └── sync-places-categories.ts
├── src/
│   ├── app/
│   │   ├── (auth)/            # login, OAuth callback
│   │   ├── (app)/             # authenticated shell
│   │   │   ├── layout.tsx     # sidebar + topbar
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── growth/
│   │   │   │   ├── prospecting/page.tsx
│   │   │   │   ├── prospecting/[id]/page.tsx
│   │   │   │   └── opportunities/page.tsx
│   │   │   ├── crm/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── integrations/page.tsx
│   │   │       └── ai/page.tsx
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   └── cron/
│   │   ├── layout.tsx
│   │   ├── error.tsx
│   │   ├── not-found.tsx
│   │   └── globals.css
│   ├── modules/
│   │   ├── growth/
│   │   │   ├── prospecting/   # actions, service, repository, schema, components/
│   │   │   ├── crm/           # same structure
│   │   │   ├── dashboard/
│   │   │   └── settings/
│   │   ├── _shared/           # cross-module types + components only
│   │   └── README.md          # how to add a new module
│   ├── lib/                   # FOUNDATION services
│   │   ├── ai/                # router, providers/, tasks/, prompts/, cost-tracker, audit-log
│   │   ├── adapters/          # places/, email/, oauth/
│   │   ├── db/                # client, transactions, rls
│   │   ├── auth/              # session, middleware, guards
│   │   ├── observability/     # logger, request-id, sentry, metrics
│   │   ├── validation/        # zod helpers
│   │   ├── errors/            # typed errors
│   │   ├── config/            # env.ts (zod-validated)
│   │   └── utils/             # result, id, retry
│   ├── styles/                # tokens.css, typography.css
│   ├── types/
│   └── instrumentation.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── fixtures/
├── .env.example
├── biome.json
├── components.json
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

### Module Boundary Rules (Enforced)

- A module imports from `src/lib/*` and `src/modules/_shared/*` freely.
- A module NEVER imports from another module.
- Cross-module communication = database reads (by ID, never joins) or Server Actions invoked from the app shell.
- Each module exposes its public API via `index.ts` at its root.
- Routes under `src/app/(app)/<module>/` import components only from `src/modules/<module>/components/`.

---

## Database Design (Strict)

Every table MUST have:
- `id` (ULID string, 26 chars, generated by `gen_random_ulid()`)
- `workspace_id` (string, FK to workspaces, default to user's personal workspace)
- `created_at`, `updated_at`, `deleted_at` (soft delete)
- `metadata` (jsonb, default `{}`)

Tables to create (Prisma models):

**Foundation:**
- `Workspace` (id, name, slug, plan, timestamps)
- `User` (id, workspace_id, email, name, avatar_url, role, timestamps)
- `ApiKey` (id, workspace_id, provider, encrypted_key, timestamps) — for user-supplied API keys
- `Integration` (id, workspace_id, provider, status, metadata, timestamps)
- `AiCostRecord` (id, workspace_id, task_id, model, input_tokens, output_tokens, cost_usd_cents, created_at)
- `AiPromptLog` (id, workspace_id, task_id, model, input_hash, input_json, output_json, duration_ms, tokens_in, tokens_out, error_message, created_at)

**AXIOM Growth:**
- `BusinessCategory` (id, workspace_id nullable for global, label, google_place_type, icon, created_at)
- `City` (id, name, country_code, lat, lng, place_id, created_at)
- `Prospect` (id, workspace_id, place_id [unique per workspace], name, category_id, city_id, address, phone, website, email, rating, user_ratings_count, price_level, business_status, google_url, lat, lng, metadata jsonb, analysis_status enum, quality_score int, score_rationale jsonb, signals jsonb, opportunities jsonb, analyzed_at, analyzed_by_model, message_draft, message_draft_model, message_draft_at, message_edited, user_notes, converted_to_lead_id, timestamps)
- `Lead` (id, workspace_id, prospect_id nullable, name, business_name, email, phone, website, source enum, status enum, quality_score, final_message, priority int, assigned_to_id, last_contacted_at, next_follow_up_at, outreach_channel, outreach_sent_at, metadata jsonb, timestamps)
- `LeadActivity` (id, lead_id, type, content, metadata, timestamps)
- `LeadEvent` (id, lead_id, event_type, from_value, to_value, metadata, created_at)

Enums: `Plan`, `UserRole`, `IntegrationStatus`, `AnalysisStatus` (PENDING, IN_PROGRESS, COMPLETED, FAILED, SKIPPED), `LeadSource` (PROSPECTING, MANUAL, IMPORTED, REFERRAL), `LeadStatus` (NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST, ARCHIVED).

### Row-Level Security

Enable RLS on every table. Policies scope by `workspace_id = current_setting('app.workspace_id')::text`. Use `src/lib/db/rls.ts` to run `SET LOCAL app.workspace_id = $1` inside every transaction.

Write a test that tries to read another workspace's data and asserts it fails.

---

## AI Router (Critical Abstraction)

Implement `src/lib/ai/router.ts` exporting:

```ts
export const aiRouter = {
  complete: async <T>(params: {
    task: string;            // e.g. 'prospect_analysis'
    input: unknown;          // validated by the task's inputSchema
    modelOverride?: string;  // e.g. 'claude-opus-4'
    providerOverride?: string;
  }): Promise<Result<T, AppError>>;
};
```

Behavior:
1. Resolve task from `src/lib/ai/tasks/<task>.ts`. Each task exports: `{ taskName, defaultModel, fallbackModel?, promptTemplate, inputSchema (zod), outputSchema (zod) }`.
2. Validate input against `inputSchema`. On fail, return `err` immediately.
3. Check cache (`ai_prompt_logs` by `input_hash`). If hit and age < 7 days, return cached output.
4. Render prompt template with input.
5. Call provider (`AnthropicProvider`). On 429/500/timeout: exponential backoff retry, max 3 attempts.
6. Validate output against `outputSchema`. On fail: retry once with a stricter prompt appending "Your previous response was invalid: <error>". On second fail: log to `ai_prompt_logs` with `error_message` and return `err`.
7. On success: persist to `ai_prompt_logs`, record cost to `ai_cost_records`, return `ok(output)`.
8. If task has `fallbackModel` and primary model fails twice, retry with fallback.

Tasks to implement:
- `prospect_analysis` — default model Sonnet. Input: Prospect (without PII like phone/email unless necessary). Output: `{ signals: Signal[], opportunities: Opportunity[], quality_score: 0-100, score_rationale: string }`.
- `opportunity_detection` — Sonnet. Input: Prospect. Output: `{ opportunities: Opportunity[] }`. (Can be folded into prospect_analysis for MVP, but the task file should exist.)
- `message_draft` — Sonnet. Input: Prospect + analysis. Output: `{ subject: string, body: string }`. Personalized, concise, no spam.
- `message_polish` — Opus. Input: Prospect + analysis + draft. Output: polished `{ subject, body }`. Used for prospects with `quality_score >= 80`.

Prompt templates live in `src/lib/ai/prompts/*.md`, versioned (`v1`, `v2`, ...). Header explains task, input, output, version history.

Cost tracker: per-model $/token table in `src/lib/ai/cost-tracker.ts`. Updated monthly from Anthropic's pricing. Every `aiRouter.complete()` call appends to `ai_cost_records`.

ESLint rule: `no-restricted-imports` forbids `@anthropic-ai/sdk` outside `src/lib/ai/providers/`.

---

## Google Places Adapter

Implement `src/lib/adapters/places/google-places.ts` exporting:

```ts
export const googlePlacesAdapter: PlacesAdapter = {
  search: async (params: { city: string; category: string; maxResults?: number })
    : Promise<RawProspect[]>,
  getDetails: async (placeId: string): Promise<RawProspectDetails>,
};
```

Use Google Places API (New) — Text Search + Place Details. Map Google's response to our `Prospect` shape. Idempotent upsert in `ProspectingRepository.upsertMany()` keyed by `(workspace_id, place_id)`.

Rate limit: max 10 RPS (well under Google's 100 QPS limit). Exponential backoff on 429.

Seed categories via `scripts/sync-places-categories.ts` — pulls Google's place type taxonomy and seeds `business_categories`.

ESLint rule: forbid direct `fetch('https://maps.googleapis.com/*')` outside `src/lib/adapters/places/`.

---

## UI Architecture — Linear/Notion Hybrid

Design tokens as CSS variables in `src/styles/tokens.css`. Dark mode primary. Accent color: sage green (`#4ade80`). Neutral grays. Inter font, JetBrains Mono for code.

App shell: persistent sidebar (240px / 56px collapsed) + topbar (search, user menu). Command palette (`cmd+k`) for global search + quick actions.

Routes:
- `/login` — magic link + Google OAuth
- `/dashboard` — KPI cards, recent leads, pipeline chart
- `/growth/prospecting` — search form + prospect list + detail panel
- `/growth/prospecting/[id]` — full prospect detail (optional dedicated page)
- `/growth/opportunities` — filtered list of high-opportunity prospects
- `/crm` — leads table
- `/crm/[id]` — lead detail with timeline, activities, outreach actions
- `/settings` — profile, integrations (Gmail connect), AI config (read-only)

Server Components by default. Client Components only where interactivity requires it (forms, command palette, live updates). Server Actions for every mutation. TanStack Query for optimistic updates. Supabase Realtime for analysis completion.

Keyboard: `j/k` navigate rows, `Enter` opens detail, `e` edits message, `cmd+enter` approves + converts, `cmd+k` command palette.

Accessibility: WCAG 2.1 AA, keyboard-reachable everything, axe-core in CI.

---

## Outreach (Human-in-the-Loop, Anti-Spam)

Three channels, all require explicit user action:

1. **Copy to Clipboard** — writes `final_message` to clipboard, logs `LeadEvent` with `event_type='message_copied'`.
2. **WhatsApp click-to-chat** — generates `https://wa.me/<phone>?text=<urlencoded-message>`, opens in new tab, logs `event_type='whatsapp_opened'`. User still hits send in WhatsApp.
3. **Gmail send** — OAuth-connected, scope `gmail.send` only. Sends via Gmail API. Logs `event_type='email_sent'` with message ID. Updates `lead.outreach_sent_at`.

Hard limits (enforced server-side):
- Max 20 prospects per search.
- Max 50 leads created per day per workspace.
- Max 10 emails sent per day per workspace.
- After 5 emails in 1 hour, 1-hour cooldown.

NO "send all" button. NO bulk send. NO automation. Every send is one-at-a-time, explicit, audited.

Gmail OAuth implementation:
- Use `arctic` for the OAuth flow.
- Store tokens encrypted (AES-256-GCM) in `integrations.metadata`.
- Refresh tokens automatically before expiry.
- Disconnect button revokes tokens and clears the row.

---

## Development Phases (Sequential, No Skipping)

### Phase 0 — Foundation Bootstrap
**Model:** Claude Sonnet 4.5. Mechanical scaffolding.
**DoD:** Repo boots, type-checks, lints, deploys to Vercel staging. Login works via magic link. Pre-commit hook active. CI green.

### Phase 1 — AI Router & Adapters
**Model:** Claude Opus 4. Critical abstraction.
**DoD:** `aiRouter.complete({ task: 'prospect_analysis', input: mockProspect })` returns validated typed result. Cost logged. Prompt logged. Cache hit on second call. ADR-0003 written.

### Phase 2 — Google Places Adapter & Categories
**Model:** Claude Sonnet 4.5. Mechanical.
**DoD:** "Barbershops in Madrid" persists 20–60 prospects idempotently. Categories seeded with 50+ entries. Tests cover pagination, rate-limit, errors.

### Phase 3 — Prospecting UI & AI Analysis Flow
**Model:** Claude Opus 4 for analysis pipeline + prompt quality. Claude Sonnet 4.5 for UI.
**DoD:** Search → analyze → view scores + drafts → edit → approve. Realtime updates. All AI through router (verify zero direct SDK imports).

### Phase 4 — CRM & Lead Conversion
**Model:** Claude Sonnet 4.5. CRUD-heavy.
**DoD:** Approve prospect → creates lead → visible in CRM → status changes log events. Dashboard shows correct KPIs.

### Phase 5 — Outreach & Email Integration
**Model:** Claude Opus 4 reviews OAuth security. Claude Sonnet 4.5 implements.
**DoD:** Gmail connect works. Send email from lead → arrives. Copy + WhatsApp channels work. All sends logged. Hard limits enforced. Security review passes.

### Phase 6 — Hardening, Observability, Documentation
**Model:** Claude Opus 4. Final polish.
**DoD:** E2E tests green. Lighthouse ≥ 90. `pnpm audit` clean. README + ADRs + runbooks complete. Staging stable 7 days.

Each phase has its own DoD checklist (see §13). No phase starts until the previous is complete. Commits land on `develop` via squash-merge PR.

---

## Definition of Done (Apply to Every PR)

- [ ] TypeScript strict passes, no errors.
- [ ] ESLint passes, zero warnings.
- [ ] Prettier formatted.
- [ ] No `console.log`, no `any` (without justification comment).
- [ ] No TODOs without owner + ticket.
- [ ] Unit tests for new logic. Coverage ≥ 80% on changed files.
- [ ] Integration tests for new repository methods.
- [ ] E2E test for new user flow.
- [ ] RLS policies written + tested.
- [ ] Zod validation on every input boundary.
- [ ] No secrets in client code.
- [ ] `pnpm audit` clean.
- [ ] No N+1 queries (verified by query-count test).
- [ ] Lighthouse ≥ 90 on affected pages.
- [ ] API responses < 500ms p95 (excluding external APIs).
- [ ] JSDoc on new exports.
- [ ] README updated if setup changed.
- [ ] ADR written for architectural decisions.
- [ ] Structured logs on new Server Actions.
- [ ] Sentry events on caught errors.
- [ ] AI calls logged with cost.
- [ ] PR description complete (What / Why / How to test / Phase / Milestone).
- [ ] CI green.

---

## Coding Standards (Strict)

- **TypeScript:** `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`. No `any`. No `!` non-null assertions outside tests.
- **Naming:** Files `kebab-case.ts` / `PascalCase.tsx`. Variables `camelCase`. Types `PascalCase`. Constants `SCREAMING_SNAKE_CASE`. DB columns `snake_case`. Tables `snake_case` plural. Enums `PascalCase` type, `SCREAMING_SNAKE_CASE` values.
- **React:** Function components only. Server Components by default. `'use client'` only when needed. Named exports, no default exports for components. Props typed with interface named `ComponentProps`.
- **Styling:** Tailwind only. Design tokens via CSS variables. shadcn/ui customized for Linear/Notion density. Dark mode default.
- **API:** Server Actions named `verbNoun`. Return `Result<T, AppError>`. Zod schemas co-located. Cursor-based pagination.
- **DB:** Every query through a repository method. Transactions for multi-table writes. Explicit column lists. No N+1.
- **File length:** Components ≤ 200 lines. Server Actions ≤ 100. Services ≤ 300. Repositories ≤ 200 per table.
- **Comments:** Explain *why*, not *what*. JSDoc on every export. TODOs need owner + ticket.

---

## Git Workflow

- **Branches:** `main` (prod), `develop` (staging), `feat/<scope>-<desc>`, `fix/<scope>-<desc>`, `chore/<desc>`, `docs/<desc>`.
- **Commits:** Conventional Commits. `<type>(<scope>): <subject>` then body explaining *why*. Subject ≤ 72 chars, imperative, lowercase, no period. Body wrapped at 100 chars.
- **PRs:** One PR per feature. Squash-merge to `develop`. Merge-commit to `main` for releases. At least one approval. CI green. Description template: What / Why / How to test / Phase / Milestone / Checklist.
- **No force-push to `main` or `develop`.** No direct commits to `main` or `develop`. Rebase over merge when possible.

---

## Documentation Rules

- **README:** Project overview, quick start, architecture summary, folder structure, dev commands, deployment summary, links to detailed docs.
- **ADRs:** `docs/adr/NNNN-<title>.md`. Format: Status, Context, Decision, Consequences, Alternatives, References. Immutable once accepted. Supersede via new ADR.
- **Runbooks:** `docs/runbooks/<topic>.md`. Required: deploy, rollback, rotate-secrets, database-migration, ai-cost-monitoring, google-places-quota, disaster-recovery. Each answers: what it does, how to know it's healthy, how to know it's broken, what to do when broken, who owns it.
- **API docs:** Auto-generated from zod schemas into `docs/api/`.
- **Code docs:** JSDoc on every export. Comments explain why. ADR references in code comments for architectural decisions.
- **Prompts:** Versioned markdown in `src/lib/ai/prompts/`. Header explains task, input, output, version history.

---

## Testing Strategy

- **Unit (Vitest):** All utilities, zod schemas (valid + invalid cases), AI router (cache hit/miss, retry, fallback, error), adapter request/response mapping, Result type.
- **Integration (Vitest + local Supabase Docker):** Repository methods with real Postgres + real RLS. Server Actions with mocked adapters. AI tasks with mocked Anthropic. Places adapter with MSW-mocked Google.
- **E2E (Playwright):** Login → dashboard. Search → analyze → edit message → approve → see in CRM. Connect Gmail (mocked OAuth) → send email → verify event. Lead status change → event logged → dashboard updates.
- **Coverage:** ≥ 80% statements + branches on changed files. Enforced in CI.
- **AI golden-file tests:** Known input → expected output shape (not exact text). Weekly CI job re-runs against latest models to detect drift.
- **Test DB:** `supabase start` for local Docker Postgres. Migrate + seed per suite. Truncate per test. Parallel via separate schemas.

---

## Future-Ready Hooks (Do NOT Implement Future Modules)

- `workspace_id` on every table → multi-tenant evolution is RLS policy + UI switcher, not schema rewrite.
- `aiRouter` abstraction → adding OpenAI/Mistral/local is one new file in `providers/`.
- Adapter pattern → swapping Places for OSM, or Gmail for Outlook, is one new file.
- `metadata jsonb` on every table → adding audit fields later is config, not migration.
- `enqueueJob(task, payload)` interface → swap inline async for Inngest/BullMQ later without call-site changes.
- Module folder structure → future modules plug into `src/modules/<name>/` with a manifest, no Foundation changes.
- `next-intl` setup → adding languages is a translation file, not a refactor.

---

## Anti-Spam Safeguards (Critical)

- The MVP is NOT bulk outreach. Quality over quantity.
- Hard limits (server-enforced): 20 prospects/search, 50 leads/day, 10 emails/day, 5 emails/hour → 1-hour cooldown.
- All sends require explicit human action. NO "send all" button. EVER.
- Future automation must go through a separate "Automation" module with its own review gates — NOT bolted onto the MVP.

---

## Phase 6 "Second Module" Drill

To prove the architecture is sound, Phase 6 includes a drill: spec out (but DO NOT implement) a hypothetical second module ("AXIOM Projects"). Verify the Foundation accommodates it without changes. If it doesn't, fix the Foundation before shipping.

---

## Execution Instructions for Antigravity

1. **Start with Phase 0.** Do not skip ahead. Do not implement Phase 3 features during Phase 0.
2. **At the end of each phase**, run the Definition of Done checklist. Do not start the next phase until every box is checked.
3. **Write an ADR** for every architectural decision. Start the ADR before the implementation, not after.
4. **Commit frequently** — one logical change per commit. Conventional Commits format.
5. **Open a PR** at the end of each phase (or sub-phase if large). Include the phase number + milestone in the PR description.
6. **Run tests** before every commit (Husky pre-commit does this for you).
7. **Update the README** whenever setup steps change.
8. **When in doubt, ask.** If a requirement is ambiguous, do not guess. Open a question in the PR description and pause.
9. **Optimize for the decade.** Every shortcut now is a tax later. Pay full price today.
10. **No future modules.** Build the Foundation + AXIOM Growth. Leave hooks for the rest. The rest will come.

---

## Final Reminder

AXIOM is not a demo. It is not a prototype. It is a tool the user will run every day for the next decade. Build it that way.

---

*End of Master Prompt.*
