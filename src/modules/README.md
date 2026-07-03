# How to add a new AXIOM module

Each module lives at `src/modules/<module-name>/` and follows this structure:

```
src/modules/<module-name>/
├── index.ts              # Public API — only export what other modules may use
├── actions.ts            # Server Actions (mutations)
├── service.ts            # Business logic (calls repository)
├── repository.ts         # DB access via Prisma (never call prisma directly in service/actions)
├── schema.ts             # Zod input/output schemas
└── components/           # React components (Server Components by default)
    └── *.tsx
```

## Rules (spec §3.1)

1. A module may import from `src/lib/*` and `src/modules/_shared/*` freely.
2. A module may **NOT** import from another module's folder.
   Cross-module communication happens via the database (reads) or via Server Actions invoked from the UI shell.
3. A module exposes its public API through its own `index.ts` at the module root.
   Anything not exported there is internal.
4. Routes under `src/app/(app)/<module>/` may import components from `src/modules/<module>/components/` only.

## Adding a route

Register a new route at `src/app/(app)/<module-name>/page.tsx`.
That page may import **only** from `src/modules/<module-name>/components/`.

## Adding a database table

Add the model to `prisma/schema.prisma`, then run:
```bash
pnpm prisma migrate dev --name add-<model-name>
```
Add RLS policies to the Supabase dashboard or via a SQL migration file.
