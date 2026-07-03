# AXIOM Engineering Playbook

Version: 1.0

Status: Active

Owner: AXIOM Engineering

Related Documents:

- AXIOM_Master_Spec.md
- BUILD_LOG.md
- DECISIONS.md
- AI_DEVELOPMENT_RULES.md
- AXIOM_Design_Language.md
- AXIOM_Design_System.md
- All ADRs
- AI Roles

---

# Purpose

The Engineering Playbook defines how AXIOM is built.

It is the operational handbook followed by every engineer, AI model and contributor participating in the project.

While the Master Specification defines what the product is, this document defines how engineering work is executed.

Its objective is consistency, quality, long-term maintainability and engineering excellence.

---

# Vision

AXIOM is expected to evolve for many years.

Every engineering decision must optimize for long-term sustainability rather than short-term speed.

Every contribution should improve the project.

Never simply add code.

Improve the system.

---

# Engineering Philosophy

AXIOM follows five immutable principles.

## Build for ten years.

Never optimize only for the current Sprint.

Every architectural decision should remain valid years from now.

---

## Simplicity over cleverness.

Readable code always beats clever code.

Future developers—including AI models—must understand every implementation quickly.

---

## Explicit over implicit.

Hidden behavior creates bugs.

Every important decision should be visible, documented and intentional.

---

## Modular over coupled.

Each module should be independently understandable.

Dependencies should remain minimal.

---

## Quality over speed.

Shipping quickly is valuable.

Shipping technical debt is expensive.

Never knowingly introduce avoidable debt.

---

# Project Workflow

Every implementation follows the same lifecycle.

1. Review documentation.

2. Understand the Sprint.

3. Validate architecture.

4. Identify risks.

5. Present implementation plan.

6. Wait for approval when required.

7. Implement.

8. Validate.

9. Document.

10. Commit.

11. Stop.

Never skip steps.

---

# Required Reading Before Every Sprint

Every AI or engineer must review, when relevant:

- AXIOM_Master_Spec.md
- BUILD_LOG.md
- DECISIONS.md
- AI_DEVELOPMENT_RULES.md
- AXIOM_Design_Language.md
- AXIOM_Design_System.md
- ADR documents
- AI Role documents

No implementation begins without sufficient context.

---

# Sprint Discipline

Each Sprint has a single objective.

Never implement outside the approved scope.

If additional improvements are discovered:

Document them.

Do not implement them.

Wait for approval.

---

# Architecture Governance

Architecture changes are high-impact decisions.

Examples include:

- New frameworks
- New databases
- Dependency injection changes
- Repository restructuring
- Module boundaries
- Authentication strategy
- State management
- API contracts
- Shared libraries

Whenever one of these changes is proposed:

Stop.

Explain.

Present alternatives.

Wait for approval.

Never proceed automatically.

---

# Decision Making

Whenever multiple valid solutions exist:

Present:

- Option A
- Option B
- Pros
- Cons
- Recommendation

Do not choose automatically.

---

# Ambiguity Policy

If documentation is unclear:

Never guess.

Never infer.

Never improvise.

Pause implementation.

Request clarification.

---

# Documentation Policy

Engineering documentation evolves continuously.

Whenever architecture changes:

Update DECISIONS.md.

Whenever a Sprint finishes:

Update BUILD_LOG.md.

Whenever engineering rules evolve:

Update AI_DEVELOPMENT_RULES.md.

Whenever UI philosophy evolves:

Update Design documentation.

Documentation is part of the product.

---

# Build Log Policy

BUILD_LOG.md records:

Sprint number

Date

Completed work

Technical decisions

Issues

Resolutions

Validation results

Never modify historical entries.

Only append.

---

# Decision Log Policy

DECISIONS.md contains permanent engineering decisions.

Never remove previous decisions.

If a decision changes:

Create a new entry.

Reference the previous one.

Explain why it changed.

---

# ADR Policy

Architecture Decision Records exist for significant architectural decisions.

Create an ADR when:

Architecture changes.

New infrastructure is adopted.

Core dependencies change.

Security strategy changes.

Database strategy changes.

Authentication changes.

Communication protocols change.

Minor implementation details do not require ADRs.

---

# Code Quality Standards

Every implementation must satisfy:

Type-safe.

Readable.

Modular.

Documented.

Reusable.

Consistent.

Testable.

Maintainable.

Predictable.

Production-ready.

---

# Performance Standards

Performance is a feature.

Prefer:

Server Components.

Streaming.

Lazy loading.

Caching.

Minimal JavaScript.

Avoid unnecessary rendering.

Measure before optimizing.

---

# Security Standards

Security is mandatory.

Never expose secrets.

Validate every input.

Sanitize user data.

Protect routes.

Use least privilege.

Never trust the client.

---

# UI Standards

All interfaces must follow:

AXIOM Design Language.

AXIOM Design System.

Accessibility guidelines.

Responsive behavior.

Consistent spacing.

Consistent typography.

Consistent motion.

---

# AI Collaboration

Different AI models may collaborate.

Each model should:

Read current documentation.

Respect previous decisions.

Avoid contradicting approved architecture.

Explain recommendations.

Never overwrite existing work without justification.

---

# Human Approval Points

Approval is mandatory before:

Architecture changes.

Database migrations.

Major dependency additions.

Repository restructuring.

Authentication redesign.

Public API changes.

Design language changes.

Business logic changes affecting multiple modules.

---

# Validation Checklist

Before every commit:

✓ pnpm lint

✓ pnpm typecheck

✓ pnpm build

✓ Manual verification

✓ BUILD_LOG updated

✓ Documentation updated if necessary

✓ No unresolved TODOs

✓ No temporary debugging code

✓ No dead code

---

# Git Workflow

Development occurs in isolated work.

Every completed Sprint:

Validate.

Commit.

Document.

Push.

Never commit broken builds.

Never ignore lint or type errors.

---

# Definition of Done

Work is complete only if:

The approved Sprint scope is finished.

The project builds successfully.

Lint passes.

TypeScript passes.

Documentation is updated.

Architecture remains consistent.

No technical debt was knowingly introduced.

All changes are reviewed.

---

# Continuous Improvement

After every Sprint ask:

Can this be simpler?

Can this be clearer?

Can this be reused?

Can this be faster?

Can this be documented better?

Engineering quality is never finished.

---

# Anti-Patterns

Never:

Guess requirements.

Skip documentation.

Ignore architecture.

Bypass validation.

Introduce unnecessary dependencies.

Duplicate logic.

Ignore accessibility.

Ignore performance.

Ignore maintainability.

Continue after discovering ambiguity.

---

# Engineering Culture

AXIOM engineering values:

Curiosity.

Discipline.

Humility.

Consistency.

Craftsmanship.

Long-term thinking.

Transparency.

Continuous learning.

Quality.

Ownership.

Every contributor is responsible for improving the project.

---

# Golden Rule

Every line of code written today should make future development easier, not harder.

The goal is not simply to ship software.

The goal is to build an engineering platform capable of evolving for the next decade while maintaining exceptional quality.