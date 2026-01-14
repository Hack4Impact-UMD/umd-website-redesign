# Homepage & Navbar Redesign Plan

This document outlines the comprehensive task list for redesigning the homepage and navbar using the new tech stack (Tailwind CSS + shadcn/ui) and design tokens defined in `/docs/STYLING.md`.

**Branch:** `frontend-redesign-tasks-01/13`
**Mockup Reference:** Attached Figma export
**Target:** Complete homepage + navbar + footer redesign

---

## Overview

### Current vs New Structure

| Current | New (Mockup) |
|---------|--------------|
| Hero with static image + text | Hero carousel with team photos |
| Featured Projects cards | Explore Our Nonprofit Partners (map placeholder) |
| Students/Nonprofits dual CTA | Testimonials from Nonprofit Partners |
| Supporters (tiered logos) | Newsletter section with subscription |
| Footer (gradient background) | Sponsors section (tiered, cleaner) |
| | CTA "Come Make an Impact" |
| | Redesigned dark footer |

### Key Decisions
- **Map section:** Skip for now (placeholder)
- **Newsletter preview:** Static image placeholder
- **Testimonials:** Hardcoded initially (migrate to CMS later)
- **Remove:** Current Featured Projects carousel, Students/Nonprofits CTA split

---

## Phase 1: Foundation & Setup ✅

### Global Styles & Theme
- [x] Update `/frontend/src/index.css` with new CSS variables from STYLING.md
- [x] Update `/frontend/tailwind.config.js` with new color tokens and typography
- [x] Add font-heading (Karla) and font-body (Rubik) to Tailwind config
- [x] Define typography utility classes (text-display, text-h1, text-h2, text-h3, etc.)
- [ ] Test that shadcn components render correctly with new theme

### File Structure Prep
- [x] Create `/frontend/src/components/home/` directory for new homepage components
- [x] Create `/frontend/src/components/layout/` directory for Navbar and Footer
- [x] Plan component file naming convention (PascalCase, `.tsx` extension)

---

## Phase 2: Navbar Redesign ✅

### Component: `/frontend/src/components/layout/Navbar.tsx`

**Current state:** Gradient background (blue-to-cyan), 4 nav links, hamburger mobile menu

**New design (from mockup):**
- Clean header bar
- "hack4impact-UMD" logo/text on left
- Navigation links on right (placeholder "Section" labels in mockup)
- Simpler, more minimal styling

### Tasks
- [x] Create new `Navbar.tsx` component using Tailwind + shadcn
- [x] Implement logo component with H4I branding
- [x] Define navigation link structure (reusing old: About Us, Our Work, Apply, Contact Us)
- [x] Style navbar with new design tokens
- [x] Implement sticky/fixed positioning
- [x] Add mobile hamburger menu (responsive at 1000px breakpoint)
- [x] Implement mobile slide-out menu with new styling
- [x] Add dropdown for "Apply" link (For Students / For Nonprofits)
- [x] Ensure proper z-index layering (above page content)
- [x] Add smooth scroll behavior for anchor links
- [ ] Test keyboard navigation and accessibility
- [ ] Remove old `/frontend/src/components/navbar/` when complete

### Navigation Links to Define
- [x] Confirm final navigation structure (About Us, Our Work, Apply dropdown, Contact Us)
- [x] Decide if any new sections need navbar links (none needed)

---

## Phase 3: Hero Section (Carousel) ✅

### Component: `/frontend/src/components/home/HeroCarousel.tsx`

**Current state:** Static hero with background SVG, heading text, single CTA button

**New design (from mockup):**
- Full-width image carousel with team/event photos
- Overlaid text: "Hack4Impact-UMD" + description
- Two CTA buttons: Primary (blue filled) + Secondary (white outline)
- Carousel navigation arrows (bottom left)

### Tasks
- [x] Create `HeroCarousel.tsx` component
- [x] Implement carousel using Keen Slider
- [x] Add carousel slide structure with image backgrounds
- [x] Style overlay text container with proper contrast
- [x] Implement primary button (blue filled): "Learn More" → /aboutus
- [x] Implement secondary button (white outline): "Apply Now" → /apply/student
- [x] Add left/right navigation arrows
- [x] Add slide indicator dots
- [x] Implement auto-play with pause on hover
- [x] Ensure responsive behavior on mobile
- [ ] Add image loading states with fade-in
- [x] Source hero images (using existing assets as placeholders)
- [ ] Remove old `/frontend/src/components/home_page/HomePageTop.tsx` when complete

### Content to Define
- [x] Determine hero carousel images (2 slides using existing assets)
- [x] Define headline text per slide (same text)
- [x] Define CTA button text and destinations

---

## Phase 4: Nonprofit Partners Map Section (Placeholder) ✅

### Component: `/frontend/src/components/home/NonprofitMapSection.tsx`

**Current state:** Does not exist

**New design (from mockup):**
- Section title: "Explore Our Nonprofit Partners"
- Subtitle text
- Interactive map showing project locations (SKIP FOR NOW)
- Popup cards with project info

### Tasks
- [x] Create `NonprofitMapSection.tsx` placeholder component
- [x] Add section heading and subtitle styling
- [x] Add placeholder illustration for map area
- [x] Style section container with proper spacing
- [x] Add "Coming Soon" placeholder state
- [ ] Document future implementation requirements:
  - Map library selection (Mapbox, Leaflet, Google Maps)
  - Strapi schema for geolocation data
  - Popup card component design

---

## Phase 5: Testimonials Section ✅

### Component: `/frontend/src/components/home/TestimonialsSection.tsx`

**Current state:** Does not exist

**New design (from mockup):**
- Dark background section
- Section title: "Testimonials from Our Nonprofit Partners"
- Quote cards with:
  - Large quote icon (")
  - Quote text
  - Person name
  - Organization name
- Multiple testimonials in row (3 visible in mockup)

### Tasks
- [x] Create `TestimonialsSection.tsx` component
- [x] Style section with dark background (`#0F172A`)
- [x] Style section title with inverse text color
- [x] Implement quote card design with glass-morphism effect
- [x] Add hardcoded testimonial data (3 testimonials)
- [x] Add responsive grid layout (3 columns desktop, 1 mobile)
- [x] Ensure proper contrast and readability on dark background

### Content to Define
- [x] Source placeholder testimonial quotes
- [x] Placeholder nonprofit partner names and organizations
- [x] 3 testimonials to display

---

## Phase 6: Newsletter Section ✅

### Component: `/frontend/src/components/home/NewsletterSection.tsx`

**Current state:** Does not exist

**New design (from mockup):**
- Two-column layout (text left, preview right)
- Heading: "Check Out Our Recent Newsletter"
- Description text
- "Subscribe For Updates" subheading
- Email input field
- Subscribe button
- Newsletter preview image (static)
- Stats display (149 active members, 7 nonprofits, etc.)

### Tasks
- [x] Create `NewsletterSection.tsx` component
- [x] Implement two-column layout with Tailwind grid/flex
- [x] Style heading and description text
- [x] Implement email subscription form with shadcn components
- [x] Add newsletter preview card (styled instead of image)
- [x] Style stats section with grid layout
- [x] Add responsive stacking for mobile

### Content to Define
- [x] Using styled card instead of image for newsletter preview
- [x] Stats hardcoded (149 members, 7 nonprofits, etc.)
- [x] Using placeholder for email service integration

---

## Phase 7: Sponsors Section (Redesign) ✅

### Component: `/frontend/src/components/home/SponsorsSection.tsx`

**Current state:** `/frontend/src/components/home_page/Supporters.tsx` with tiered sponsor logos

**New design (from mockup):**
- Section title: "Our sponsors"
- Tiered layout: Platinum, Gold, Silver, Bronze
- Cleaner grid layout for sponsor logos
- Microsoft placeholder logos (will be replaced with real sponsors)

### Tasks
- [x] Create new `SponsorsSection.tsx` component
- [x] Style section title
- [x] Implement tier headings (Platinum, Gold, Silver, Bronze)
- [x] Style sponsor logo grid with responsive layout
- [x] Migrate existing sponsor logo assets
- [x] Add image loading states
- [x] Ensure responsive behavior on mobile
- [ ] Remove old `/frontend/src/components/home_page/Supporters.tsx` when complete

### Assets
- [x] Using existing sponsor logos from `/frontend/src/components/assets/supporters/`

---

## Phase 8: CTA Section ✅

### Component: `/frontend/src/components/home/CTASection.tsx`

**Current state:** `/frontend/src/components/home_page/HomePageLower.tsx` (Students/Nonprofits dual CTA)

**New design (from mockup):**
- Simple centered section
- Heading: "Come Make an Impact With Us!"
- Two buttons side by side

### Tasks
- [x] Create `CTASection.tsx` component
- [x] Style centered heading with proper typography
- [x] Implement two CTA buttons (primary and outline)
- [x] Add proper spacing and section padding
- [ ] Remove old `/frontend/src/components/home_page/HomePageLower.tsx` when complete

### Content to Define
- [x] "Join as Student" → /apply/student
- [x] "Partner With Us" → /apply/nonprofit

---

## Phase 9: Footer Redesign ✅

### Component: `/frontend/src/components/layout/Footer.tsx`

**Current state:** Gradient background SVG, 3 link columns, social icons, contact info

**New design (from mockup):**
- Dark background (`#0F172A` / `bg-inverse`)
- H4I logo on left side
- Newsletter subscription form (duplicate of main section?)
- Social media icons
- Multiple navigation columns ("Explore" headers with page links)
- Contact information section
- Address: 7809 Regents Drive, College Park, MD 20742
- Email: umd@hack4impact.org

### Tasks
- [x] Create new `Footer.tsx` component using Tailwind
- [x] Implement dark background with inverse text colors
- [x] Add H4I logo/wordmark
- [x] Implement newsletter subscription form
- [x] Add social media icons (Instagram, GitHub, LinkedIn, Facebook)
- [x] Create navigation columns (Explore, Apply, Contact)
- [x] Add contact information section
- [x] Ensure responsive stacking on mobile
- [ ] Remove old `/frontend/src/components/footer/Footer.tsx` when complete

### Content to Define
- [x] Footer navigation: Explore (About Us, Our Work, Contact), Apply (Students, Nonprofits)
- [x] Contact email: umd@hack4impact.org
- [x] Social links: Instagram, GitHub, LinkedIn, Facebook

---

## Phase 10: Homepage Assembly ✅

### File: `/frontend/src/App.tsx` (Homepage defined inline)

### Tasks
- [x] Update `App.tsx` to use new components
- [x] Implement section order:
  1. Navbar (from layout)
  2. HeroCarousel
  3. NonprofitMapSection (placeholder)
  4. TestimonialsSection
  5. NewsletterSection
  6. SponsorsSection
  7. CTASection
  8. Footer (from layout)
- [x] Remove imports of old components
- [x] Ensure proper section spacing with Tailwind
- [ ] Test scroll behavior and navigation
- [ ] Verify responsive behavior at all breakpoints

---

## Phase 11: Cleanup & Migration

### ⚠️ DEPRECATED Components (to be removed later)

The following old components are **deprecated** and replaced by new ones. Keep for reference but remove when ready:

| Deprecated Component | Replaced By | Location |
|---------------------|-------------|----------|
| `HomePageTop.tsx` | `HeroCarousel.tsx` | `/frontend/src/components/home_page/` |
| `HomePageLower.tsx` | `CTASection.tsx` | `/frontend/src/components/home_page/` |
| `Supporters.tsx` | `SponsorsSection.tsx` | `/frontend/src/components/home_page/` |
| `Navbar.tsx` (old) | `Navbar.tsx` (new) | `/frontend/src/components/navbar/` → `/frontend/src/components/layout/` |
| `Footer.tsx` (old) | `Footer.tsx` (new) | `/frontend/src/components/footer/` → `/frontend/src/components/layout/` |

### Old Directories to Remove (when ready)
- [ ] `/frontend/src/components/home_page/` - Old homepage components
- [ ] `/frontend/src/components/navbar/` - Old navbar
- [ ] `/frontend/src/components/footer/` - Old footer
- [ ] `/frontend/src/styles/home/` - Old homepage CSS modules
- [ ] `/frontend/src/styles/navbar/` - Old navbar CSS modules
- [ ] `/frontend/src/styles/footer/` - Old footer CSS modules

### Update App.tsx ✅
- [x] Update Navbar import path to new location
- [x] Update Footer import path to new location
- [x] Remove any unused imports

### Verify No Regressions
- [ ] Test all navigation links work correctly
- [ ] Test Apply dropdown functionality
- [ ] Test mobile hamburger menu
- [ ] Test footer links
- [ ] Verify no console errors
- [ ] Check network requests work (Strapi API calls if any remain)

---

## Phase 12: Testing & QA

### Responsive Testing
- [ ] Test at 320px (mobile small)
- [ ] Test at 375px (mobile medium)
- [ ] Test at 768px (tablet)
- [ ] Test at 1000px (breakpoint)
- [ ] Test at 1280px (desktop)
- [ ] Test at 1920px (large desktop)

### Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces content correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states are visible
- [ ] Images have alt text

### Performance
- [ ] Lighthouse audit (aim for 90+ performance)
- [ ] Images are optimized
- [ ] No layout shift on load

---

## Open Questions / TBD

1. **Navbar Links:** What are the actual navigation items? (Currently showing "Section" placeholders)
2. **Hero CTAs:** What text and destinations for the two hero buttons?
3. **Hero Images:** Source for carousel images? How many slides?
4. **Testimonials:** Need to source actual quotes from nonprofit partners
5. **Newsletter Stats:** Are these dynamic or hardcoded? (149 members, 7 nonprofits, etc.)
6. **Footer Email:** Is it still `umd@hack4impact.org` or different?
7. **Footer Columns:** What links go in each "Explore" column?
8. **Final CTA Buttons:** Text and destinations?

---

## Dependencies & Libraries

**Already Installed:**
- Tailwind CSS
- shadcn/ui (Button, Card, Input, etc.)
- Keen Slider (for carousel)
- Lucide React (icons)
- Axios (API calls)

**May Need:**
- Map library (Mapbox/Leaflet) - future, when map section is implemented

---

## Component Count

| Component | Status |
|-----------|--------|
| Navbar.tsx | ✅ Complete |
| HeroCarousel.tsx | ✅ Complete |
| NonprofitMapSection.tsx | ✅ Complete (placeholder) |
| TestimonialsSection.tsx | ✅ Complete |
| NewsletterSection.tsx | ✅ Complete |
| SponsorsSection.tsx | ✅ Complete |
| CTASection.tsx | ✅ Complete |
| Footer.tsx | ✅ Complete |

**Total: 8 new components created**
