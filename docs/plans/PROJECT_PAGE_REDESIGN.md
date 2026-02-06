# Project Page Redesign Plan

> **STATUS: PLANNED** 📝
>
> **Branch:** TBD
> **Mockup Reference:** Attached wireframes (Project page)
> **Target:** Full redesign of Project detail page using Tailwind CSS + shadcn/ui and `/docs/STYLING.md`

This document outlines the comprehensive, step-by-step plan for redesigning the Project page to match the new visual system and layout defined in the wireframes. All components should use design tokens and classes from `/docs/STYLING.md` for clean, minimal, and consistent styling.

---

## Overview

### Current vs New Structure

| Current | New (Wireframe) |
|---------|------------------|
| Header + project info in CSS Modules | Hero section with clear value prop + CTA buttons |
| Simple team members list | Full page narrative: Problem → Solution → Features → Impact |
| No impact metrics or testimonials | Impact stats band + testimonials section |
| No tech stack or related projects | Tech stack icon row + “View More Work” cards |
| Legacy layout + styles | Fully tokenized Tailwind + shadcn/ui components |

### Key Decisions
- **Tech stack:** Tailwind CSS + shadcn/ui for all new components.
- **Data:** Continue using Strapi project data; map content into new sections.
- **Accessibility:** Maintain semantic headings and visible focus states.
- **Minimal UI:** Use light surfaces, consistent spacing, and neutral typography from STYLING.md.

---

## Phase 1: Foundation & Data Mapping

- [ ] TASK 1: Audit current Project page data dependencies (`ProjectPage.tsx`) and list fields needed for each new section (title, blurb, dates, links, images, team, stats, testimonials).
- [ ] TASK 2: Define a data mapping plan for missing fields (e.g., impact stats, problem/solution text, features, testimonials, tech stack) including placeholder strategy if Strapi lacks data.
- [ ] TASK 3: Identify reusable components (Button, Card, Badge, Avatar) from shadcn/ui and confirm variants align with STYLING.md tokens.

---

## Phase 2: Layout & Section Architecture

### New Component Structure (Proposed)
```
frontend/src/components/project/
├── ProjectHero.tsx
├── ProjectOverview.tsx
├── ProjectProblemSolution.tsx
├── ProjectFeatures.tsx
├── ProjectImpact.tsx
├── ProjectTestimonials.tsx
├── ProjectTechStack.tsx
├── ProjectTeam.tsx
├── ProjectMoreWork.tsx
└── ProjectCTA.tsx
```

- [ ] TASK 4: Create `/frontend/src/components/project/` directory and index export.
- [ ] TASK 5: Define a top-level `<ProjectPageLayout>` (or refactor `ProjectPage.tsx`) to compose all new sections in the wireframe order.

---

## Phase 3: Hero & Overview

### Section: ProjectHero
**Wireframe cues:** Hero banner with project name, short value statement, CTA buttons, and logo/metadata row.

- [ ] TASK 6: Build `ProjectHero.tsx` with heading, one-sentence value prop, date/season, and CTA buttons (e.g., “View App”, “View Repo”).
- [ ] TASK 7: Style hero with `bg-primary` or `bg-inverse` (depending on final contrast) and `text-inverse-foreground` for clarity.
- [ ] TASK 8: Ensure CTAs follow STYLING.md button conventions (primary + secondary).

### Section: ProjectOverview
**Wireframe cues:** Left-aligned overview copy with an adjacent card or screenshot.

- [ ] TASK 9: Create `ProjectOverview.tsx` with responsive 2-column layout (text + image/preview).
- [ ] TASK 10: Use `Card` for preview image placeholder and standard body copy styles.

---

## Phase 4: Problem → Solution Narrative

### Section: ProjectProblemSolution
**Wireframe cues:** “The Problem” and “The Solution” blocks with icon bullets.

- [ ] TASK 11: Build `ProjectProblemSolution.tsx` with two stacked cards or a 2-column layout.
- [ ] TASK 12: Add icon bullets for each problem/solution item using Lucide icons.
- [ ] TASK 13: Ensure consistent spacing and muted text for descriptions per STYLING.md.

---

## Phase 5: Key Features + Screenshots

### Section: ProjectFeatures
**Wireframe cues:** Feature list with supporting screenshots.

- [ ] TASK 14: Create `ProjectFeatures.tsx` with alternating layout (text + image).
- [ ] TASK 15: Use a reusable `FeatureItem` subcomponent for consistent spacing and typography.
- [ ] TASK 16: Include support for 2–3 features with bullet lists and optional screenshots.

---

## Phase 6: Impact & Results

### Section: ProjectImpact
**Wireframe cues:** Dark band with impact metrics and testimonial cards below.

- [ ] TASK 17: Build `ProjectImpact.tsx` with a `bg-inverse` band and 3–4 impact stats.
- [ ] TASK 18: Add a testimonial card row (or integrate as separate `ProjectTestimonials.tsx` if cleaner).
- [ ] TASK 19: Ensure high-contrast text and consistent card styling for dark backgrounds.

---

## Phase 7: Tech Stack

### Section: ProjectTechStack
**Wireframe cues:** “How We Built It” with icon grid.

- [ ] TASK 20: Create `ProjectTechStack.tsx` using a grid of tech icons (with labels).
- [ ] TASK 21: Use placeholder icons if final assets are unavailable; document replacements.

---

## Phase 8: Team

### Section: ProjectTeam
**Wireframe cues:** Team photo and grid of member cards with LinkedIn.

- [ ] TASK 22: Create `ProjectTeam.tsx` with a team photo banner and member grid.
- [ ] TASK 23: Reuse or adapt `PersonCard` styling from About page to keep consistency.
- [ ] TASK 24: Ensure member cards use `font-heading`, `font-body`, and `text-muted-foreground`.

---

## Phase 9: Related Projects + CTA

### Section: ProjectMoreWork
**Wireframe cues:** “View More of Our Work” with project cards.

- [ ] TASK 25: Create `ProjectMoreWork.tsx` with a 2–3 card grid using existing project card styles.
- [ ] TASK 26: Link cards to `/ourwork` or individual projects.

### Section: ProjectCTA
**Wireframe cues:** Final CTA banner with two buttons.

- [ ] TASK 27: Create `ProjectCTA.tsx` with centered heading + two CTAs (Apply as student / Partner with us).
- [ ] TASK 28: Follow STYLING.md CTA button styling and spacing standards.

---

## Phase 10: Page Assembly & Migration

- [ ] TASK 29: Refactor `ProjectPage.tsx` to use new components and remove CSS module imports.
- [ ] TASK 30: Ensure all sections render gracefully if optional data is missing (fallback copy/placeholders).
- [ ] TASK 31: Validate responsive layout at mobile, tablet, and desktop breakpoints.

---

## Phase 11: Cleanup & Deprecation

- [ ] TASK 32: Identify legacy CSS modules in `/frontend/src/styles/projects/` and mark for removal once new layout is confirmed.
- [ ] TASK 33: Remove unused assets or icons after verifying all new sections work.

---

## Phase 12: Testing & QA

- [ ] TASK 34: Verify semantic heading order (H1 → H2 → H3).
- [ ] TASK 35: Confirm color contrast meets WCAG AA.
- [ ] TASK 36: Test focus states for all buttons and links.
- [ ] TASK 37: Smoke test on 375px, 768px, 1024px, and 1440px widths.

---

## References

- **Design Tokens:** `/docs/STYLING.md`
- **Homepage Plan Structure:** `/docs/plans/HOMEPAGE_NAVBAR_REDESIGN.md`
- **Current Project Page:** `/frontend/src/pages/ProjectPage.tsx`
