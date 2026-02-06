# Our Work Page Redesign Plan

> **STATUS: NOT STARTED** ⏳
>
> **Branch:** `main`
> **Mockup Reference:** Wireframes (attached)
> **Target:** Redesign the Our Work project detail page using Tailwind CSS + shadcn/ui and design tokens from `/docs/STYLING.md`.

This document outlines the comprehensive task list for redesigning the Our Work page to match the new visual system while keeping the implementation minimal, clean, and maintainable.

---

## Overview

### Current vs New Structure

| Current | New (Wireframe) |
|---------|-----------------|
| Single-column project detail layout | Multi-section storytelling layout with hero, problem/solution, features, impact, team, and CTA |
| Minimal visual hierarchy | Strong sectioning, clear headings, and alternating backgrounds |
| Limited project storytelling | Structured narrative: problem → solution → impact → team |

### Key Decisions
- **Design System:** Use Tailwind classes from `/docs/STYLING.md` (colors, typography, buttons, cards).
- **Componentization:** Break the page into small, reusable sections to keep code clean.
- **Content Source:** Start with hardcoded content for wireframe parity; wire Strapi CMS later.
- **Images:** Use existing assets as placeholders; keep image handling consistent via `next/image` or standard `<img>` (based on current stack).

---

## Phase 1: Foundation & Setup

- [ ] Audit existing Our Work page implementation and identify reusable components (if any).
- [ ] Create `/frontend/src/components/our-work/` directory for the new sections.
- [ ] Define a consistent section wrapper utility (e.g., `Section` component or shared classes).
- [ ] Confirm typography and color tokens match `/docs/STYLING.md` for headings, body, and buttons.

---

## Phase 2: Hero Section

**Goal:** Match the wireframe hero with project title, subtitle, short description, CTAs, and a hero media block.

- [ ] Create `OurWorkHero.tsx` component.
- [ ] Add project title, one-sentence description, and metadata (nonprofit name, date).
- [ ] Implement primary + secondary CTA buttons (e.g., “View App”, “Read Case Study”).
- [ ] Add hero media (project screenshot or placeholder image) with rounded corners and shadow.
- [ ] Ensure responsive stacking (text above media on mobile).

---

## Phase 3: About + Problem Section

**Goal:** Introduce the nonprofit and clarify the problem statement.

- [ ] Create `AboutProjectSection.tsx` component.
- [ ] Add left column: “About [Nonprofit]” text block.
- [ ] Add right column: “The Problem” card with 2–3 bullet pain points.
- [ ] Use `bg-card`, `border-border`, and `text-muted-foreground` tokens for subtle styling.
- [ ] Ensure card spacing and consistent typography (H3 + body text).

---

## Phase 4: Solution Section

**Goal:** Provide a concise overview of the solution with supporting visual(s).

- [ ] Create `SolutionSection.tsx` component.
- [ ] Add section header and supporting paragraph.
- [ ] Add a grid of 2–3 solution highlights (each with icon, title, short description).
- [ ] Include a full-width screenshot or mockup beneath highlights (placeholder image).
- [ ] Apply section padding and `bg-muted` to separate from surrounding content.

---

## Phase 5: Key Features Section

**Goal:** Highlight features in alternating content blocks to keep the page engaging.

- [ ] Create `KeyFeaturesSection.tsx` component.
- [ ] Implement a list of feature blocks (image + bullets) that alternate left/right alignment.
- [ ] Use reusable `FeatureBlock` subcomponent to avoid duplicated layout code.
- [ ] Ensure bullets use consistent spacing, `text-muted-foreground`, and accessible list semantics.

---

## Phase 6: Impact & Results

**Goal:** Showcase quantitative outcomes and testimonials in a high-contrast section.

- [ ] Create `ImpactResultsSection.tsx` component with `bg-inverse` styling.
- [ ] Add 3 key metric cards (e.g., “5,000+ photos organized”).
- [ ] Add testimonial cards below metrics with quote, name, and organization.
- [ ] Use `text-inverse-foreground` for headings and proper contrast for body text.

---

## Phase 7: How We Built It

**Goal:** Communicate the tech stack or build process with a row of tool badges.

- [ ] Create `HowWeBuiltItSection.tsx` component.
- [ ] Add grid of tech logos (e.g., Node.js, React, Postgres) in consistent card containers.
- [ ] Use `bg-muted` or subtle card backgrounds to separate from main content.
- [ ] Ensure logo sizing is consistent and accessible (alt text).

---

## Phase 8: Meet the Team

**Goal:** Display team members with a hero group photo and individual cards.

- [ ] Create `MeetTeamSection.tsx` component.
- [ ] Add team photo banner with rounded corners.
- [ ] Add “Product & Design” and “Engineering” sub-sections.
- [ ] Build reusable `TeamMemberCard` (avatar, name, role, LinkedIn icon).
- [ ] Use consistent grid layout and spacing across both teams.

---

## Phase 9: View More Work

**Goal:** Encourage exploration of other projects via cards.

- [ ] Create `MoreWorkSection.tsx` component.
- [ ] Add section title + two project cards with image, title, nonprofit name.
- [ ] Include “View More of Our Work” link or button.
- [ ] Reuse existing project card components if available; otherwise build a minimal variant.

---

## Phase 10: CTA Section

**Goal:** Close with a strong call-to-action for students and nonprofits.

- [ ] Create `OurWorkCTASection.tsx` component.
- [ ] Add heading: “Ready to Work with Us?”
- [ ] Add two buttons: “Apply Nonprofit” (primary) and “I’m a Student” (outline).
- [ ] Ensure button styles use brand tokens and hover/active states from `/docs/STYLING.md`.

---

## Phase 11: Page Assembly

**File:** `/frontend/src/pages/OurWork.tsx` (or current Our Work page entry)

- [ ] Replace existing layout with new section components in order:
  1. OurWorkHero
  2. AboutProjectSection
  3. SolutionSection
  4. KeyFeaturesSection
  5. ImpactResultsSection
  6. HowWeBuiltItSection
  7. MeetTeamSection
  8. MoreWorkSection
  9. OurWorkCTASection
- [ ] Ensure page uses `bg-background` and consistent vertical spacing.
- [ ] Remove any old layout code and unused imports.

---

## Phase 12: Data & CMS Integration (Future)

- [ ] Identify Strapi collections/fields needed for project detail content.
- [ ] Replace hardcoded data with CMS-driven content once schemas exist.
- [ ] Add loading and error states where data is fetched.

---

## Phase 13: Testing & QA

### Visual & Responsive
- [ ] Verify layout at 320px, 768px, 1024px, 1280px.
- [ ] Confirm section spacing and hierarchy match wireframes.
- [ ] Ensure images scale without distortion and maintain aspect ratio.

### Accessibility
- [ ] Validate heading hierarchy (H1 → H2 → H3).
- [ ] Ensure all images have alt text.
- [ ] Confirm color contrast meets WCAG AA, especially in `bg-inverse` sections.

### Interaction
- [ ] Verify all CTA buttons and links navigate correctly.
- [ ] Check focus states on buttons and links.

---

## Dependencies & Libraries

**Already Available:**
- Tailwind CSS
- shadcn/ui components (Button, Card, etc.)
- Lucide React (icons)

**Potential Additions (if needed):**
- None required for initial redesign

---

## Component Summary

| Component | Purpose |
|-----------|---------|
| OurWorkHero | Hero with title, CTAs, and media |
| AboutProjectSection | Nonprofit intro + problem card |
| SolutionSection | Solution overview + highlights |
| KeyFeaturesSection | Alternating feature blocks |
| ImpactResultsSection | Metrics + testimonials |
| HowWeBuiltItSection | Tech stack badges |
| MeetTeamSection | Team photo + member cards |
| MoreWorkSection | Related projects cards |
| OurWorkCTASection | Closing call-to-action |

---

## References

- **Design Tokens:** `/docs/STYLING.md`
- **Homepage Plan Format:** `/docs/plans/HOMEPAGE_NAVBAR_REDESIGN.md`
- **Wireframes:** Provided in task prompt
