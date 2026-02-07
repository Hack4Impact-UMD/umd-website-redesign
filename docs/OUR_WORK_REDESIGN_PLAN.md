# OUR_WORK_REDESIGN.md

## Goal
Create a pixel-accurate, production-ready redesign of the **Our Work** page to match the provided wireframe while following `STYLING.md` conventions and keeping implementation minimal, clean, and elegant.

## Execution Checklist

- [ ] TASK 1: Review baseline and lock redesign scope.
  - Audit current `our_work` components/styles and document what will be reused vs replaced.
  - Confirm exact sections from wireframe: top nav, hero banner + overlay, yearly project grids, and footer.
  - Identify all page states (loading, populated, empty/fallback, and API-failure behavior).

- [ ] TASK 2: Convert wireframe into implementation specs before coding.
  - Extract concrete spacing, sizing, typography, radius, shadow, and color targets from the wireframe.
  - Define desktop/tablet/mobile breakpoints for the page and each section.
  - Create a short acceptance checklist for “perfect alignment” (layout, spacing rhythm, hierarchy, visual balance).

- [ ] TASK 3: Apply `STYLING.md` rules and map styles to tokens/utilities.
  - Replace hardcoded visual values with approved tokens/utilities where possible.
  - Standardize typography styles for section headers, card titles, metadata text, and hero copy.
  - Ensure naming, file organization, and CSS patterns follow `STYLING.md` and existing project conventions.

- [ ] TASK 4: Rebuild page shell structure for wireframe parity.
  - Implement/adjust hero area with dark overlay, centered heading, and subtitle text.
  - Ensure section container widths and horizontal gutters match the design rhythm.
  - Verify footer spacing and alignment consistency with the wireframe.

- [ ] TASK 5: Implement yearly project sections with clean data flow.
  - Group projects by year (e.g., 2025, 2024) and render deterministic section order.
  - Add reusable section component(s) for year header + card grid.
  - Keep data transformation logic separate from presentational rendering.

- [ ] TASK 6: Redesign the project card component to match the wireframe.
  - Build card with image region, branded top-left badge area, blue info strip, and right-arrow action affordance.
  - Enforce consistent card height/width, image fit behavior, and bottom strip alignment.
  - Add hover/focus states that are subtle and consistent with styling rules.

- [ ] TASK 7: Implement responsive grid behavior across breakpoints.
  - Desktop: 3-column layout with consistent horizontal/vertical gaps.
  - Tablet: transition to 2 columns while preserving card proportions and spacing.
  - Mobile: 1-column stack with readable typography, touch-friendly spacing, and no clipping.

- [ ] TASK 8: Ensure accessibility and semantic quality.
  - Use semantic headings hierarchy (`h1` for hero, `h2` for yearly sections).
  - Ensure color contrast and text legibility over hero image overlay.
  - Add descriptive alt text and keyboard-accessible interactive targets.

- [ ] TASK 9: Clean up and simplify implementation.
  - Remove redundant wrappers, dead styles, and duplicate variants.
  - Consolidate shared spacing/typography patterns into reusable style rules.
  - Keep component APIs small and explicit; avoid premature abstractions.

- [ ] TASK 10: Validate with QA checks and visual comparison.
  - Run lint/typecheck/tests and fix regressions introduced by redesign.
  - Perform manual UI verification at key viewport widths against the wireframe.
  - Capture final screenshots and document any intentional deviations.

- [ ] TASK 11: Update project documentation for maintainability.
  - Document component structure and styling decisions for the redesigned page.
  - Add notes for future contributors on extending yearly sections and card content.
  - Include a concise “Definition of Done” checklist tied to wireframe parity.

## Definition of Done
- Layout and spacing are visually aligned to the wireframe across desktop/tablet/mobile.
- Styling adheres to `STYLING.md` and repository standards with minimal custom exceptions.
- Code is clean, modular, and free of redundant styling/component logic.
- Accessibility, linting, and functional checks pass.
