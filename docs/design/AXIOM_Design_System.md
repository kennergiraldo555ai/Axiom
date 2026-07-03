# AXIOM Design System

Version: 1.0

Status: Active

Owner: AXIOM Engineering

Related Documents:

- AXIOM_Design_Language.md
- AXIOM_Master_Spec.md
- AI_DEVELOPMENT_RULES.md

---

# Purpose

The AXIOM Design System defines the visual, interaction and implementation standards used throughout the AXIOM ecosystem.

Its objective is to ensure that every screen, every component and every interaction feels as if it had been designed by the same world-class product team.

This document is the single source of truth for every frontend implementation.

Whenever a conflict exists between design ideas and this document, this document prevails.

---

# Core Philosophy

AXIOM is not a traditional dashboard.

AXIOM is an operating system for entrepreneurs powered by Artificial Intelligence.

The interface should feel:

• Fast

• Elegant

• Calm

• Intelligent

• Premium

• Professional

The interface should disappear behind the work.

---

# Visual Inspiration

AXIOM studies—not copies—the following products:

• Linear

• Stripe Dashboard

• Apple

• Raycast

• Vercel

• Notion

• Arc Browser

• ChatGPT

Each contributes a specific strength:

Linear → Density & Navigation

Stripe → Information Hierarchy

Apple → Motion & Polish

Raycast → Productivity

Vercel → Engineering UI

Notion → Readability

Arc → Fluidity

ChatGPT → AI-first interactions

---

# Design Principles

Every interface must be:

Simple.

Predictable.

Consistent.

Readable.

Accessible.

Responsive.

Performant.

Elegant.

Every pixel must have a purpose.

---

# Layout System

Maximum content width:

1600px

Default page padding:

32px desktop

24px tablet

16px mobile

Every page follows:

Topbar

↓

Page Header

↓

Content Sections

↓

Cards

↓

Data

Never build floating layouts without justification.

---

# Grid System

Desktop

12 columns

Tablet

8 columns

Mobile

4 columns

Spacing follows an 8px scale.

Never use arbitrary spacing.

---

# Spacing Scale

4

8

12

16

24

32

40

48

64

80

96

128

Spacing should communicate hierarchy.

Whitespace is intentional.

---

# Border Radius

Small

8px

Medium

12px

Large

16px

Extra Large

24px

Cards should never exceed 24px radius.

Avoid exaggerated rounding.

---

# Shadows

Minimal.

Soft.

Never dramatic.

Use shadows only to establish hierarchy.

Never for decoration.

---

# Color Philosophy

Dark mode is the default.

The interface should rely on neutral colors.

Accent colors communicate action.

Never use color as decoration.

Every color must communicate meaning.

---

# Primary Palette

Background

Near Black

Surface

Dark Gray

Surface Elevated

Slightly lighter gray

Primary

Blue

Success

Green

Warning

Amber

Danger

Red

Information

Cyan

Text Primary

White

Text Secondary

Gray

Borders

Low Contrast Gray

---

# Typography

Primary Font

Inter

Monospace

JetBrains Mono

Never introduce additional font families.

---

# Typography Scale

Display

48

H1

36

H2

30

H3

24

H4

20

Body Large

18

Body

16

Small

14

Caption

12

Hierarchy must come from typography before color.

---

# Iconography

Lucide Icons.

Outlined.

Simple.

Consistent stroke width.

Avoid mixing icon styles.

---

# Motion Philosophy

Motion should communicate.

Never entertain.

Animation duration:

150ms

200ms

250ms

300ms

Use easing.

Never bounce.

Never exaggerated motion.

---

# Buttons

Button hierarchy:

Primary

Secondary

Outline

Ghost

Danger

Loading

Disabled

Every button has:

Hover

Focus

Active

Disabled

Loading

Keyboard state

No exceptions.

---

# Inputs

Every input includes:

Label

Placeholder

Helper text

Validation

Error state

Success state

Disabled state

Loading state

Focus state

Accessibility labels

---

# Cards

Cards are the primary content container.

Each card should contain:

Title

Optional description

Content

Optional footer

Never overload a single card.

Split information when necessary.

---

# Tables

Professional.

Dense.

Easy to scan.

Sticky headers.

Hover state.

Sorting indicators.

Pagination.

Empty state.

Loading state.

Selection state.

Bulk actions.

---

# Sidebar

Permanent.

Minimal.

Collapsible.

Icons always visible.

Text may collapse.

Navigation grouped by modules.

Never exceed two navigation levels.

---

# Topbar

Contains:

Search

Global AI

Notifications

User Menu

Quick Actions

Breadcrumbs when appropriate.

---

# Dashboard Philosophy

Dashboards answer questions.

Not display everything.

Every widget exists because it supports a decision.

---

# AI Components

Every AI interaction should include:

Context

Progress

Streaming when appropriate

Ability to cancel

Clear status

Confidence when available

Action history

Never leave users wondering what AI is doing.

---

# Empty States

Every empty state should include:

Illustration or icon

Short explanation

Primary action

Optional documentation link

Never show blank pages.

---

# Loading States

Prefer skeleton loaders.

Avoid infinite spinners.

Loading should preserve layout stability.

---

# Error States

Errors must explain:

What happened.

Why.

How to recover.

Never blame the user.

---

# Notifications

Use Sonner.

Keep notifications short.

Maximum duration:

5 seconds

Critical notifications require user acknowledgement.

---

# Accessibility

WCAG AA minimum.

Keyboard navigation.

Visible focus indicators.

Semantic HTML.

Screen reader compatibility.

Color contrast compliance.

Accessibility is mandatory.

---

# Responsive Rules

Mobile First.

No horizontal scrolling.

Touch targets:

Minimum 44px.

Every page must work on:

Desktop

Laptop

Tablet

Mobile

---

# Performance Rules

Prefer Server Components.

Minimize Client Components.

Lazy load heavy modules.

Optimize images.

Reduce JavaScript.

Avoid unnecessary renders.

Performance is a feature.

---

# Component Rules

Before creating a component ask:

Does one already exist?

Can it be reused?

Can it be composed?

Can it become more generic?

Never duplicate UI.

---

# Naming Rules

Components:

PascalCase

Hooks:

camelCase starting with use

Files:

Match component names

CSS Variables:

kebab-case

Consistency is mandatory.

---

# AI-Assisted Design

Nano Banana Pro is the official visual ideation assistant.

It may be used to generate:

Wireframes

Dashboards

Illustrations

Icons

Landing Pages

Mockups

Motion Concepts

Marketing Assets

Generated visuals are inspiration only.

Production assets require review.

---

# Design References

Maintain the following folders:

docs/design/references/

images/

dashboards/

components/

motion/

landing-pages/

mobile/

desktop/

branding/

competitors/

Every reference must be categorized.

Never copy.

Study.

Adapt.

Improve.

---

# Anti-Patterns

Never:

Copy competitors.

Overuse gradients.

Abuse glassmorphism.

Use random spacing.

Mix icon styles.

Introduce unnecessary colors.

Animate everything.

Duplicate components.

Break consistency.

Sacrifice usability for aesthetics.

---

# Definition of Done

A frontend implementation is complete only when:

✓ Matches the Design Language.

✓ Fully responsive.

✓ Accessible.

✓ Type-safe.

✓ Lint passes.

✓ Performance acceptable.

✓ Consistent with existing components.

✓ Uses design tokens.

✓ No duplicated UI.

✓ Approved by Code Reviewer.

---

# Future Evolution

This document is versioned.

Future versions may introduce:

Advanced Motion System

Complete Component Library

Token System

Accessibility Matrix

Animation Library

Interaction Patterns

Design Tokens

Microinteractions

Charts

Data Visualization

Native Mobile Guidelines

This document should evolve with AXIOM without breaking previously established principles.

---

# Golden Rule

Do not build beautiful interfaces.

Build interfaces that users never have to think about.

Beauty emerges naturally from clarity, consistency and craftsmanship.
