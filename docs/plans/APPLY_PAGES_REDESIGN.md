# Apply Pages Redesign Plan (Student + Nonprofit)

This document outlines the task list for redesigning the Apply as a Student and Apply as a Nonprofit pages using the new design system in `/docs/STYLING.md` and the attached wireframes. The plan mirrors the structure and level of detail in `HOMEPAGE_NAVBAR_REDESIGN.md` while focusing on actionable, minimal, and elegant implementation steps.

**Branch:** `apply-pages-redesign`
**Mockup Reference:** Attached wireframes (Apply as a Student, Apply as a Nonprofit)
**Target:** Complete redesign of both apply pages using Tailwind CSS + shadcn/ui

---

## Overview

### Page Sections (Both Pages)
- Hero with background image + title overlay
- Intro section with heading, body copy, CTA button, and supporting image
- Informational section (Roles for Student / Criteria for Nonprofit)
- Application Process & Timeline (3-step list)
- Testimonials band (dark/inverse background)
- FAQ accordion
- Final CTA band (Apply + Secondary CTA)
- Footer (reuse existing global footer)

### Key Decisions
- Reuse existing layout primitives (section wrappers, grid utilities, buttons).
- Keep content data-driven via arrays to avoid repetition.
- Use `STYLING.md` tokens for all colors, typography, and states.
- Minimize custom CSS; prefer Tailwind utilities and shadcn/ui components.

---

## Tasks

- [x] **TASK 1: Audit current apply routes and components**
  - Locate current Student/Nonprofit apply pages and routes in `frontend/src`.
  - Identify any shared components that can be reused (Navbar, Footer, Button, Accordion).
  - Document current content sources (hardcoded vs CMS).

- [x] **TASK 2: Create shared layout primitives for apply pages**
  - Add a reusable `ApplyPageLayout` wrapper (padding, max-width, section spacing).
  - Add shared section helpers (e.g., `SectionHeader`, `SplitContent`, `StepList`).
  - Ensure helpers use typography tokens from `STYLING.md`.

- [x] **TASK 3: Build shared Hero section**
  - Implement `ApplyHero` with background image, overlay, and title.
  - Provide props for title, subheading (nonprofit page only), and image asset.
  - Ensure overlay contrast and responsive text sizing.

- [x] **TASK 4: Build Intro split section**
  - Implement `ApplyIntro` with left text and right image.
  - Include heading, body copy, and primary CTA button.
  - Support custom CTA label/route per page.

- [x] **TASK 5: Implement Student “Roles” grid**
  - Create a `RoleCard` component using shadcn/ui Card styles.
  - Define data for roles (Engineer, Designer, Tech Lead, Sourcing, PM, Bootcamp).
  - Use a responsive grid (3 columns desktop, 2 tablet, 1 mobile).

- [x] **TASK 6: Implement Nonprofit “Criteria/Qualifications” section**
  - Create a text-focused section with headline and 2-paragraph body.
  - Match spacing and typography to the wireframe.
  - Ensure muted background (`bg-muted`) per design system.

- [x] **TASK 7: Build Application Process & Timeline component**
  - Create `ApplyTimeline` using a numbered step list (1–3).
  - Use accessible structure (ordered list + headings + descriptions).
  - Keep step content data-driven for reuse across both pages.

- [x] **TASK 8: Build Testimonials band**
  - Reuse or extend existing testimonial card styles from homepage.
  - Implement a dark/inverse section with two quote cards.
  - Make quote content data-driven for easy updates.

- [x] **TASK 9: Build FAQ accordion**
  - Use shadcn/ui Accordion components.
  - Provide data arrays for FAQ items (4 items per wireframe).
  - Ensure full-width layout and consistent spacing.

- [x] **TASK 10: Build final CTA band**
  - Implement `ApplyCTA` with heading and two buttons.
  - Student page secondary CTA: “View Projects” (per wireframe).
  - Nonprofit page secondary CTA: “I’m a Student”.

- [x] **TASK 11: Compose Apply as a Student page**
  - Assemble the page in the wireframe order.
  - Wire content strings, image assets, and CTA routes.
  - Validate responsive behavior across breakpoints.

- [x] **TASK 12: Compose Apply as a Nonprofit page**
  - Assemble the page in the wireframe order.
  - Add sub-banner “Currently taking Fall 2025 Applications. Apply Now”.
  - Match wireframe spacing and alignment to Student page.

- [x] **TASK 13: Content + assets pass**
  - Replace placeholders with final copy and approved images.
  - Ensure alt text for all imagery.
  - Ensure consistent button labels and routes.

- [x] **TASK 14: Styling audit against STYLING.md**
  - Verify use of `bg-background`, `bg-card`, `bg-muted`, and `bg-inverse` tokens.
  - Verify all text colors use `text-foreground` / `text-muted-foreground`.
  - Confirm typography classes match token sizes and weights.

- [x] **TASK 15: Accessibility + QA**
  - Check color contrast for text over hero images.
  - Ensure keyboard navigation on accordion and buttons.
  - Confirm semantic headings (one H1 per page).

- [x] **TASK 16: Cleanup and tech debt**
  - Remove unused legacy apply page components or styles.
  - Confirm there are no unused imports or dead assets.
  - Run formatter/linter if available.

---

## Deliverables

- Updated Apply as a Student page (fully redesigned).
- Updated Apply as a Nonprofit page (fully redesigned).
- New shared components for layout and sections where appropriate.
- Consistent usage of `STYLING.md` tokens and Tailwind utilities.

---

## Dependencies & Libraries

**Already installed:**
- Tailwind CSS
- shadcn/ui (Button, Card, Accordion)
- Lucide React (icons)

**No new dependencies required** for this redesign.
