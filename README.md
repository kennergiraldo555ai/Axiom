# AXIOM

**Personal and business operating system.**
Find prospects, analyze them with AI, draft personalized outreach, and convert them to CRM leads.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC) |
| Language | TypeScript 5.9 (strict mode) |
| Database | Supabase Postgres 15+ |
| ORM | Prisma 6 |
| Auth | Supabase Auth |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Package Manager | pnpm 11 |

## Getting Started

### Prerequisites

- Node.js 22 LTS
- pnpm 11+
- A Supabase project

### 1. Clone and install

```bash
git clone <repo-url>
cd axiom
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Fill in your Supabase URL, anon key, service role key, and DB connection strings
```

### 3. Run database migrations

```bash
# Requires a connected Supabase DB
pnpm prisma migrate dev
```

### 4. Start the dev server

```bash
pnpm dev
# Open http://localhost:3000
```

## Project Structure

```
axiom/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Authenticated app shell
│   │   └── (auth)/             # Auth pages (Sprint 0.2+)
│   ├── modules/                # Feature modules
│   │   ├── _shared/            # Cross-module types
│   │   └── growth/             # AXIOM Growth module
│   ├── lib/                    # Foundation services
│   │   ├── ai/                 # AI router + providers
│   │   ├── adapters/           # External API adapters
│   │   ├── config/             # Env var validation
│   │   ├── db/                 # Prisma client
│   │   ├── errors/             # Typed error hierarchy
│   │   └── utils/              # Result<T,E>, ULID, retry
│   └── styles/                 # Design tokens + typography
├── prisma/
│   └── schema.prisma           # Database schema
└── docs/
    └── adr/                    # Architecture Decision Records
```

## Scripts

```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm typecheck    # Run TypeScript type checking
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
```

## Architecture

See [`docs/adr/`](docs/adr/) for Architecture Decision Records.
See [`AXIOM_Master_Spec.md`](docs/AXIOM_Master_Spec.md) for the full implementation specification.
