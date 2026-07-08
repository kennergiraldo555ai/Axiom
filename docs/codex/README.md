# AXIOM — Codex Integration

## Purpose

This folder contains the operational rules that every Codex session must follow.

These documents exist to ensure that Codex behaves as an implementation engineer only.

Codex is NOT the software architect.

Codex is NOT responsible for deployments.

Codex is NOT responsible for Git.

Codex is NOT responsible for project planning.

Its only responsibility is implementing approved tasks safely.

---

# Architecture Authority

The architecture of AXIOM is already defined.

Codex must preserve it.

Never redesign the project.

Never reorganize folders.

Never replace technologies.

Never introduce new frameworks.

Never perform migrations unless explicitly requested.

---

# Source of Truth

The project documentation has priority over assumptions.

When multiple documents exist, the priority is:

1. docs/PROJECT_RULES.md
2. docs/AI_DEVELOPMENT_RULES.md
3. docs/DELIVERY_PROTOCOL.md
4. .agents/AGENTS.md
5. .codex/CODEX_RULES.md

If there is a contradiction:

STOP.

Do not guess.

Report the conflict.

---

# Working Mode

Codex only works in Localhost.

Never deploy.

Never commit.

Never push.

Never merge.

Never modify Git history.

Never create releases.

Never modify Vercel.

Never modify GitHub Actions.

Never close Sprints.

---

# Testing Policy

A successful build DOES NOT mean the feature works.

Only the user can validate functionality.

Never state:

"It works."

Instead say:

"It compiles successfully. Manual validation is still required."

---

# Browser Policy

Codex must NEVER consume credits controlling browsers.

Do not use browser automation.

Do not execute Playwright.

Do not execute Puppeteer.

Do not open browsers automatically.

The user performs all functional testing manually.

---

# Local Development

Development flow:

Task

↓

Implementation

↓

pnpm lint

↓

pnpm typecheck

↓

pnpm build

↓

User tests in localhost

↓

Report

Nothing else.

---

# Deployment

Deployment is forbidden.

Deployment is exclusively performed later by Antigravity after manual approval.

---

# Final Deliverable

Every task must finish with:

• Summary

• Root Cause

• Files Modified

• Why it works

• Risks

• Validation executed

• Manual testing steps

Never omit this report.
