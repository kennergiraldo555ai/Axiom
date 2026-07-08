# AI Development Rules

**Project:** AXIOM

**Document Type:** Engineering Governance

**Status:** Active

**Version:** 1.0.0

**Last Updated:** 2026-07-03

---

# Purpose

This document defines the permanent engineering rules that every Artificial Intelligence system, automation, coding assistant and future contributor must follow while working on AXIOM.

These rules exist to guarantee long-term consistency, maintainability, architectural integrity and engineering quality.

This document has higher priority than implementation convenience.

Whenever there is uncertainty, these rules take precedence.

---

# Vision

AXIOM is not a short-term application.

It is intended to become a long-term software platform that will evolve during many years.

Every engineering decision must therefore prioritize sustainability over short-term speed.

Every contributor must think as if they will maintain this project for the next ten years.

---

# Core Engineering Philosophy

Every implementation must maximize:

- Maintainability
- Simplicity
- Readability
- Predictability
- Scalability
- Testability
- Modularity
- Developer Experience
- User Experience

Speed is important.

Engineering quality is mandatory.

---

# Golden Rules

## Rule 01

Never assume.

If information is missing:

Stop.

Ask.

---

## Rule 02

Never invent requirements.

Only implement what is explicitly defined.

---

## Rule 03

Never expand Sprint scope.

Future work belongs to future Sprints.

---

## Rule 04

Never modify architecture without approval.

If a better architecture is discovered:

Explain.

Justify.

Wait.

---

## Rule 05

Never ignore technical debt.

If technical debt is introduced intentionally:

It must be documented.

---

## Rule 06

Every important decision must be documented inside:

DECISIONS.md

---

## Rule 07

Every Sprint must update:

BUILD_LOG.md

---

## Rule 08

Every architectural decision must prioritize long-term evolution over immediate convenience.

---

## Rule 09

Every feature must respect AXIOM_Master_Spec.md.

The specification is the source of truth.

---

## Rule 10

Never rewrite existing architecture simply because another solution looks newer.

---

# Architecture Rules

Architecture is not implementation.

Architecture defines the future.

Therefore:

Changing architecture requires approval.

Examples:

- Folder structure
- Database architecture
- Authentication strategy
- State management
- Dependency Injection
- Routing
- API design
- Repository Pattern
- Domain boundaries
- New infrastructure

None of these may change automatically.

---

# Sprint Discipline

Every Sprint has exactly one goal.

Never implement functionality outside the approved Sprint.

Never "take advantage" to implement extra features.

Small shortcuts become large maintenance problems.

---

# Decision Framework

Before implementing anything ask:

1.

Is it inside the current Sprint?

If not:

Stop.

2.

Does it respect the Master Spec?

If not:

Stop.

3.

Does it increase technical debt?

If yes:

Explain.

4.

Can it be simpler?

If yes:

Simplify.

5.

Can future developers understand it?

If not:

Rewrite.

---

# Engineering Mindset

Think like an owner.

Not like a freelancer.

Every line of code should be written assuming:

"I will maintain this for ten years."

---

# Better Practice Rule

If during implementation a significantly better engineering practice is discovered:

Do not implement it automatically.

Instead:

- Explain the current solution
- Explain the proposed solution
- Explain advantages
- Explain disadvantages
- Explain migration cost
- Wait for approval

Improvement is encouraged.

Unexpected changes are forbidden.

---

# Ambiguity Rule

If documentation can be interpreted in multiple ways:

Never guess.

Present alternatives.

Explain trade-offs.

Wait for approval.

---

# Security Rules

Never expose:

- Secrets
- Keys
- Tokens
- Passwords
- Private URLs

Never hardcode credentials.

Always use environment variables.

Security is never optional.

---

# Code Quality Rules

Every implementation must be:

Readable.

Predictable.

Consistent.

Typed.

Modular.

Reusable.

Small.

Documented.

---

# Dependency Rules

Every dependency has a cost.

Before introducing one ask:

Is it really necessary?

Does it solve a real problem?

Will it still be maintained in five years?

Can the same result be achieved with existing tools?

Never install libraries for convenience alone.

---

# Refactoring Rules

Refactoring is allowed only when:

- it improves maintainability
- it reduces complexity
- it removes duplication
- it respects the current Sprint

Large refactors require approval.

---

# AI Collaboration Rules

Multiple AI systems may participate in AXIOM.

Every AI must respect previous work.

Never overwrite another AI's implementation without understanding it.

If disagreement exists:

Explain.

Never silently replace.

---

# Communication Rules

Engineering communication must be:

Objective.

Technical.

Evidence-based.

Professional.

Avoid emotional language.

Avoid assumptions.

Avoid marketing language.

---

# Review Before Coding

Before writing code always verify:

- Current Sprint
- Master Spec
- Existing Architecture
- Existing Patterns
- Existing Utilities
- Existing Components

Never duplicate work.

---

# Definition of Ready

A task is ready only if:

- Requirements are clear.
- Scope is defined.
- Architecture is understood.
- Dependencies are identified.
- Risks are known.

---

# Definition of Done

A task is complete only if:

- Requirements fulfilled.
- Architecture respected.
- No known bugs.
- TypeScript passes.
- Lint passes.
- Build passes.
- Documentation updated.
- BUILD_LOG updated.
- No hidden TODOs.
- No temporary hacks.

---

# Mandatory Verification

Every Sprint must verify:

pnpm lint

pnpm typecheck

pnpm build

pnpm dev

Failure in any verification means the Sprint is not complete.

---

# Engineering Checklist

Before finishing any task verify:

- Scope respected
- No duplicated code
- No architectural violations
- No unnecessary complexity
- No dead code
- No console logs
- No commented code
- No secrets
- No ignored errors
- Documentation updated

---

# Stop Immediately If

Immediately stop implementation if:

- Requirements conflict.
- Architecture becomes inconsistent.
- Security is compromised.
- Better architecture requires major changes.
- Specification becomes ambiguous.
- A Sprint boundary would be crossed.

---

# Continuous Improvement

Continuous improvement is encouraged.

Continuous improvisation is forbidden.

Improve deliberately.

Never accidentally.

---

# Relationship With Other Documents

This document works together with:

- AXIOM_Master_Spec.md
- BUILD_LOG.md
- DECISIONS.md
- ADR documents
- AI Role Specifications

The Master Specification defines **what** must be built.

This document defines **how engineering must behave while building it.**

---

# Final Principle

Engineering excellence is achieved through discipline, not speed.

Every contributor is expected to protect the long-term quality of AXIOM.

When in doubt:

Choose the solution that future developers will thank you for.

---

# AI Provider Architecture

## Active Provider

The active AI provider is controlled by the `AI_PROVIDER` environment variable.

Current active provider: **Gemini** (`AI_PROVIDER=gemini`)

Anthropic remains implemented as a secondary adapter and can be reactivated by changing `AI_PROVIDER=anthropic`.

## Provider Adapters

| Provider  | Adapter File              | Status                  |
| --------- | ------------------------- | ----------------------- |
| Gemini    | `src/lib/ai/gemini.ts`    | Active                  |
| Anthropic | `src/lib/ai/anthropic.ts` | Available (not default) |

## Model Configuration

The model is controlled by `DEFAULT_AI_MODEL` environment variable.

If not set, use cases select the model default based on the active provider:

- `AI_PROVIDER=gemini` → `gemini-1.5-flash`
- `AI_PROVIDER=anthropic` → `claude-3-5-sonnet-20240620`

## Required Environment Variables

```
AI_PROVIDER=gemini
GEMINI_API_KEY=<your Google AI Studio key>
DEFAULT_AI_MODEL=gemini-1.5-flash   # optional, overrides the default
```

## Important Notes

- The `GEMINI_API_KEY` must be a Google AI Studio key (not a Vertex AI key).
- The `Generative Language API` must be enabled in the Google Cloud project.
- The key must not have API restrictions blocking `generativelanguage.googleapis.com`.

## Architecture

```
Server Action
  → Use Case (reads AI_PROVIDER env var)
    → aiRouter.complete(request)
      → GeminiAdapter (if provider=gemini)
        → @google/genai SDK
          → generativelanguage.googleapis.com
```

Last Updated: 2026-07-07
