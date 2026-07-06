# PROJECT_RULES.md

# AXIOM - Universal Agent Operating Rules

Version: 1.0

Purpose:
This document defines the mandatory operating rules that every AI agent must follow while working on the AXIOM project.

These rules override assumptions, guesses, shortcuts, personal preferences, and autonomous decisions.

---

# PRIMARY OBJECTIVE

The current mission of AXIOM is:

1. Complete the Growth system.
2. Reach production readiness.
3. Acquire the first paying customer.
4. Generate revenue as quickly as possible.

Any work that does not directly contribute to these objectives must be considered lower priority.

---

# CORE PRINCIPLES

## Rule 1 - Never Guess

If information is missing:

STOP.

Report the uncertainty.

Do not invent requirements.

Do not invent architecture.

Do not invent business logic.

Do not invent database structures.

Do not invent user flows.

---

## Rule 2 - Sprint Scope Is Sacred

Only work on the current Sprint.

Do not:

- Add extra features
- Improve unrelated areas
- Refactor unrelated code
- Create future functionality
- Expand requirements

If it is not part of the Sprint:

Do not touch it.

---

## Rule 3 - Business Value First

When multiple options exist:

Choose the solution that delivers value faster.

Current priorities:

1. Functionality
2. Stability
3. Speed of delivery
4. Optimization
5. Perfection

Perfection is not the goal.

Shipping is the goal.

---

# ARCHITECTURE PROTECTION

## Rule 4 - Respect Existing Architecture

Never redesign the project.

Never replace frameworks.

Never introduce major architectural changes.

Work within the existing architecture unless explicitly instructed otherwise.

---

## Rule 5 - Minimize Impact Radius

Make the smallest safe change possible.

Avoid touching unrelated files.

Avoid large rewrites.

Avoid unnecessary restructuring.

---

## Rule 6 - Protect Existing Functionality

Every change must preserve:

- Existing workflows
- Existing pages
- Existing features
- Existing integrations

Never break working functionality.

---

# AGENT RESPONSIBILITIES

## Frontend Agent

Allowed:

- UI
- UX
- Components
- Styling
- Responsive behavior
- User interactions

Not allowed:

- Database changes
- Supabase schema changes
- Backend architecture changes
- API redesign

---

## Backend Agent

Allowed:

- Supabase
- APIs
- Business logic
- Data processing
- Server functionality

Not allowed:

- UI redesign
- Styling changes
- Visual component modifications

---

## Architect Agent

Allowed:

- Task decomposition
- Planning
- Dependency mapping
- Risk identification

Not allowed:

- Inventing new requirements
- Expanding Sprint scope

---

# FILE OWNERSHIP

Agents should avoid modifying the same files simultaneously.

Preferred ownership:

Frontend:

- app/
- components/
- styles/
- public/

Backend:

- supabase/
- api/
- lib/
- server/

Documentation:

- docs/
- README.md

If a file conflict exists:

STOP.

Report the conflict.

Do not continue until clarified.

---

# GITHUB RULES

Agents must never:

- Force push
- Delete branches
- Rewrite history
- Delete repositories

Agents must never assume deployment approval.

Deployment requires explicit validation.

---

# DEPLOYMENT RULES

A Sprint is NOT complete because:

- The code compiles
- The build passes
- Tests pass

A Sprint is complete only when:

1. Code is committed.
2. Code is pushed to GitHub.
3. Deployment succeeds.
4. Production works correctly.
5. GitHub and production are synchronized.

---

# VERCEL VALIDATION

Before considering work complete:

Verify:

- Deployment completed successfully.
- Production loads correctly.
- No runtime errors exist.
- No console errors exist.
- Environment variables remain intact.

---

# SUPABASE RULES

Never:

- Delete production data
- Drop tables without approval
- Remove policies without approval
- Modify authentication flows without approval

Database safety takes priority over speed.

---

# QUALITY RULES

Every completed task must be:

- Functional
- Stable
- Readable
- Maintainable

Avoid hacks.

Avoid temporary fixes unless explicitly requested.

---

# ERROR HANDLING

If an error occurs:

1. Identify root cause.
2. Explain root cause.
3. Propose solution.
4. Implement minimal safe fix.

Never stack fixes on top of unknown problems.

---

# DOCUMENTATION RULES

Any important architectural change must be documented.

Any new system must include:

- Purpose
- Location
- Dependencies
- Usage instructions

---

# COMMUNICATION FORMAT

When completing work, provide:

## Summary

What was completed.

## Files Modified

List of modified files.

## Risks

Potential concerns.

## Validation

How the work was verified.

## Next Recommended Step

The most logical next action.

---

# DEFINITION OF DONE

A task is DONE only when:

✓ Requirements completed

✓ No known critical errors

✓ Existing functionality preserved

✓ Documentation updated if necessary

✓ Ready for production validation

A task is NOT done merely because code was written.

---

# FINAL RULE

AXIOM is currently in Growth Mode.

The objective is not to build the perfect system.

The objective is to deliver real business value, reach production, acquire customers, and generate revenue.

Every decision must support that mission.
