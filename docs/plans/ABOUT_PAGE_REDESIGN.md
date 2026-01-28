# About Page Redesign Plan

> **STATUS: IMPLEMENTATION COMPLETE** ✅
>
> **Branch:** `dev/redesign`
> **Mockup Reference:** Figma export (attached)
> **Completed:** January 2026

This document outlines the comprehensive task list for redesigning the About Us page using the new tech stack (Tailwind CSS + shadcn/ui) and design tokens defined in `/docs/STYLING.md`.

---

## Overview

### Current vs New Structure

| Current | New (Mockup) |
|---------|--------------|
| Full-width header image with centered "About Us" text | Split layout: text left (description), team photo right |
| Simple text block for mission | Bordered card with blue corner brackets |
| Gradient flip cards for values | Image-based value cards with title + description |
| No projects section | Current Project Teams section (dark background) |
| Exec Board grid (circular photos) | Meet the Board grid (rounded squares + LinkedIn icon) |
| Team Members grid (same style as board) | Team Members grid (aligned to new board style) |

### Key Decisions
- **Tech Stack:** Tailwind CSS + shadcn/ui (matching homepage redesign)
- **Value Images:** Use existing team photo or placeholder images
- **LinkedIn:** Show icon placeholder (no URL in Strapi yet)
- **Projects Section:** Reuse existing `Projects` component with wrapper styling
- **Breakpoints:** 640px (mobile), 1024px (tablet), consistent with Tailwind defaults

---

## Phase 1: Foundation & Setup ✅

### File Structure Prep
- [x] Create `/frontend/src/components/about/` directory for new About page components
- [x] Plan component file naming convention (PascalCase, `.tsx` extension)

### Component Files to Create
```
frontend/src/components/about/
├── AboutHeader.tsx           # Split layout header
├── MissionSection.tsx        # Bordered mission card
├── ValuesSection.tsx         # Image-based value cards
├── CurrentProjectsSection.tsx # Dark background projects wrapper
├── MembersSection.tsx        # Reusable for Board + Team
└── PersonCard.tsx            # Individual member card with LinkedIn
```

---

## Phase 2: AboutHeader Component ✅

### Component: `/frontend/src/components/about/AboutHeader.tsx`

**Current state:** Full-width background image with centered "About Us" text overlay

**New design (from mockup):**
- Two-column grid layout
- Left: "About Us" heading + 2 descriptive paragraphs
- Right: Team photo with rounded corners
- Stacks vertically on mobile (image below text)

### Tasks
- [x] Create `AboutHeader.tsx` component
- [x] Implement responsive grid layout (`grid-cols-1 lg:grid-cols-2`)
- [x] Style heading with `font-heading text-4xl font-bold`
- [x] Style body text with `font-body text-lg text-muted-foreground`
- [x] Add team photo with `rounded-2xl object-cover`
- [x] Ensure proper spacing with Tailwind (`gap-12`, `py-16`, `px-6 lg:px-16`)
- [x] Test responsive stacking on mobile

### Content
- **Heading:** "About Us"
- **Paragraph 1:** "Hack4Impact-UMD is a student-led organization at the University of Maryland and an official chapter of Hack4Impact, a national 501(c)(3) nonprofit using technology for social good. We partner with local and mission-driven nonprofit organizations to design and build free, high-quality software that helps organizations operate more efficiently and scale their impact."
- **Paragraph 2:** "Our cross-functional teams of student designers, software engineers, and product managers collaborate closely with nonprofit partners to deliver custom web and mobile applications tailored to real organizational needs, providing sustainable technology solutions nonprofits may not otherwise have access to."
- **Image:** Use `h4igroup_photo.jpg` or `aboutus_header2023.png`

---

## Phase 3: MissionSection Component ✅

### Component: `/frontend/src/components/about/MissionSection.tsx`

**Current state:** Simple centered text block

**New design (from mockup):**
- Bordered card with blue accent
- Corner brackets (top-left, bottom-right) using pseudo-elements
- "Our Mission" heading left-aligned
- Mission statement text

### Tasks
- [x] Create `MissionSection.tsx` component
- [x] Implement bordered container with `border-2 border-primary`
- [x] Add corner bracket decorations using Tailwind absolute positioning
- [x] Style heading with `font-heading text-2xl font-bold`
- [x] Style mission text with `font-body text-lg`
- [x] Add proper padding (`px-12 py-8`) and max-width constraint
- [x] Center section with `mx-auto max-w-4xl`

### CSS for Corner Brackets
```tsx
// Use Tailwind's arbitrary values or inline styles
<div className="relative border-2 border-primary">
  {/* Top-left bracket */}
  <div className="absolute -top-0.5 -left-0.5 w-10 h-10 border-t-4 border-l-4 border-primary" />
  {/* Bottom-right bracket */}
  <div className="absolute -bottom-0.5 -right-0.5 w-10 h-10 border-b-4 border-r-4 border-primary" />
</div>
```

### Content
- **Heading:** "Our Mission"
- **Text:** "Our mission is to leverage technology for social good by building impactful software solutions for nonprofit organizations while providing students with real-world, professional experience."

---

## Phase 4: ValuesSection Component ✅

### Component: `/frontend/src/components/about/ValuesSection.tsx`

**Current state:** 3 gradient flip cards with text only (ValueCard.tsx)

**New design (from mockup):**
- Section title "Our Values" centered
- 3 image-based cards in a row
- Each card: rounded image, title below, description text
- No flip animation (static cards)

### Tasks
- [x] Create `ValuesSection.tsx` component
- [x] Implement section title with `font-heading text-3xl font-bold text-center`
- [x] Create responsive grid (`grid-cols-1 md:grid-cols-3 gap-8`)
- [x] Style value card images with `rounded-xl aspect-[4/3] object-cover w-full`
- [x] Style card titles with `font-heading text-xl font-bold mt-4`
- [x] Style card descriptions with `font-body text-base text-muted-foreground mt-2`
- [x] Source placeholder images (using team photo as placeholder)

### Content (preserve existing)
| Value | Description |
|-------|-------------|
| Go Beyond Technology | Technology is only one tool we use in our greater mission for social impact. Technology alone is not enough. We learn from, work with, and are inspired by others who are tackling social problems using a multitude of tools. |
| Develop with Care | We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. When we embark on projects, we work to deeply understand the people who we are helping. |
| Be Open Minded | Our process depends on openness to different people, topics, and perspectives. We embrace difference and work against intolerance to foster an inclusive environment. Our goal is to expose our members to the vast opportunities and daunting challenges in our work. |

### Image Strategy
- Use existing `h4igroup_photo.jpg` cropped/zoomed to different sections
- Or use `headshot_placeholder.jpg` as temporary placeholder
- Will be replaced with dedicated value images later

---

## Phase 5: CurrentProjectsSection Component ✅

### Component: `/frontend/src/components/about/CurrentProjectsSection.tsx`

**Current state:** Does not exist on About page

**New design (from mockup):**
- Dark blue background section (`bg-inverse` / `#0F172A`)
- Section header: "Current Project Teams" + "View all projects →" link
- Displays current project card(s) using existing `Projects` component

### Tasks
- [x] Create `CurrentProjectsSection.tsx` wrapper component
- [x] Implement dark background with `bg-[#0F172A]`
- [x] Style section header with flex layout (title left, link right)
- [x] Style title with `font-heading text-3xl font-bold text-white`
- [x] Style "View all projects" link with `text-white hover:text-white/80`
- [x] Import and render existing `<Projects isFeatured={false} />` component
- [x] Override child component text colors for dark background using CSS selectors
- [x] Add proper section padding (`py-16 px-6 lg:px-16`)

### Integration Notes
- Reuse existing `Projects` component from `/frontend/src/components/projects/Projects.tsx`
- May need to pass a prop or use CSS to handle dark background text contrast
- Existing `FeaturedProjectCard` may need minor styling adjustments

---

## Phase 6: PersonCard Component ✅

### Component: `/frontend/src/components/about/PersonCard.tsx`

**Current state:** `Person.tsx` - circular image, name, role, pronouns (no LinkedIn)

**New design (from mockup):**
- Rounded square image (not circular)
- Name below image
- Role/title below name
- LinkedIn icon(s) at bottom
- Cleaner typography

### Tasks
- [x] Create `PersonCard.tsx` component with proper TypeScript interface
- [x] Define props interface with proper types
- [x] Style image with `rounded-xl w-32 h-32 object-cover` (not circular)
- [x] Style name with `font-heading text-base font-bold mt-3 text-center`
- [x] Style role with `font-body text-sm text-muted-foreground text-center`
- [x] Add LinkedIn icon placeholder using Lucide (dimmed when no URL)
- [x] Use `default_pfp.png` as fallback image
- [x] Ensure consistent card sizing with fixed width

### LinkedIn Icon
- Create or source SVG icon at `/frontend/src/components/assets/icons/linkedin.svg`
- Style with `w-5 h-5 text-primary hover:text-primary/80`
- Show icon but disable click until URL is in Strapi

---

## Phase 7: MembersSection Component ✅

### Component: `/frontend/src/components/about/MembersSection.tsx`

**Current state:** Separate `ExecBoard` and `TeamMembers` functions in AboutUs.tsx

**New design (from mockup):**
- Section title "Meet the Board" or "Team Members"
- Grid of PersonCard components (4 columns desktop, 2 tablet, 1 mobile)
- Consistent styling between Board and Team sections

### Tasks
- [x] Create `MembersSection.tsx` as reusable component
- [x] Define props interface with TypeScript types
- [x] Implement Strapi data fetching using existing `useAxios` hook
- [x] Preserve exec board sorting logic (by role order)
- [x] Implement responsive grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`)
- [x] Style section title with `font-heading text-3xl font-bold text-center mb-12`
- [x] Map over members and render `PersonCard` components
- [x] Handle loading state with existing `LoadingSpinner` component
- [x] Add proper section padding

### Data Flow (unchanged)
```
Strapi API: /api/members?populate=avatar,componentRolesArr
            &filters[memberDisplayStatus][$eq]={filterStatus}
```

---

## Phase 8: AboutUs Page Assembly ✅

### File: `/frontend/src/pages/AboutUs.tsx`

### Tasks
- [x] Refactor `AboutUs.tsx` to use new components
- [x] Import all new components from `/components/about/`
- [x] Implement section order:
  1. AboutHeader
  2. MissionSection
  3. ValuesSection
  4. CurrentProjectsSection
  5. MembersSection (title="Meet the Board", filterStatus="Current Board Member")
  6. MembersSection (title="Team Members", filterStatus="Current Member")
- [x] Remove old inline component functions
- [x] Remove old CSS module import
- [x] Each section has its own padding for consistent spacing
- [x] Build passes successfully

### New AboutUs.tsx Structure
```tsx
import AboutHeader from '../components/about/AboutHeader';
import MissionSection from '../components/about/MissionSection';
import ValuesSection from '../components/about/ValuesSection';
import CurrentProjectsSection from '../components/about/CurrentProjectsSection';
import MembersSection from '../components/about/MembersSection';

function AboutUs() {
  return (
    <main className="bg-background">
      <AboutHeader />
      <MissionSection />
      <ValuesSection />
      <CurrentProjectsSection />
      <MembersSection title="Meet the Board" filterStatus="Current Board Member" />
      <MembersSection title="Team Members" filterStatus="Current Member" />
    </main>
  );
}
```

---

## Phase 9: Cleanup & Deprecation (Future)

### Files to Deprecate (remove after verification)

| Deprecated | Replaced By |
|------------|-------------|
| `/components/about_us/ValueCard.tsx` | `ValuesSection.tsx` (inline cards) |
| `/styles/about_us/ValueCard.module.css` | Tailwind classes |
| `/styles/about_us/AboutUs.module.css` | Tailwind classes |
| `/components/Person.tsx` | `PersonCard.tsx` |
| `/styles/people/Person.module.css` | Tailwind classes |

### Cleanup Tasks (deferred - verify usage first)
- [ ] Verify no other pages use `Person.tsx` before removing
- [ ] Verify no other pages use `ValueCard.tsx` before removing
- [ ] Remove deprecated CSS module files
- [ ] Remove unused asset imports
- [ ] Clean up any unused dependencies

**Note:** Cleanup deferred to avoid breaking other pages that may use these components.

---

## Phase 10: Testing & QA

### Visual Testing
- [ ] Desktop layout matches mockup (1440px viewport)
- [ ] Tablet layout is usable (768px viewport)
- [ ] Mobile layout stacks correctly (375px viewport)
- [ ] Dark section (Current Projects) has proper contrast
- [ ] All images load with proper aspect ratios

### Functional Testing
- [ ] Board members load and sort correctly by exec order
- [ ] Team members load correctly
- [ ] Current projects section displays project cards
- [ ] "View all projects" link navigates to `/ourwork`
- [ ] No console errors

### Accessibility
- [ ] All images have meaningful alt text
- [ ] Semantic HTML structure (main, section, h1-h3 hierarchy)
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus states visible on interactive elements

### Responsive Breakpoints
| Viewport | Expected Behavior |
|----------|-------------------|
| < 640px | Single column layout, stacked sections |
| 640-1024px | 2-column grids where applicable |
| > 1024px | Full desktop layout, 4-column member grid |

---

## Dependencies & Libraries

**Already Available:**
- Tailwind CSS (configured with design tokens)
- shadcn/ui components
- Axios (for Strapi API calls)
- Lucide React (icons)

**Assets Used:**
- [x] LinkedIn icon from Lucide React (no custom SVG needed)
- [x] Team photo as placeholder for value cards (`h4igroup_photo.jpg`)

---

## Component Summary

| Component | Location | Status |
|-----------|----------|--------|
| AboutHeader.tsx | `/components/about/` | ✅ |
| MissionSection.tsx | `/components/about/` | ✅ |
| ValuesSection.tsx | `/components/about/` | ✅ |
| CurrentProjectsSection.tsx | `/components/about/` | ✅ |
| PersonCard.tsx | `/components/about/` | ✅ |
| MembersSection.tsx | `/components/about/` | ✅ |
| index.ts | `/components/about/` | ✅ |

**Total: 6 new components + index created**

---

## Open Questions

1. **Value Card Images:** Using team photo crops as placeholder - confirm if dedicated images will be provided later
2. **LinkedIn URLs:** Showing placeholder icon - confirm when Strapi schema will be updated
3. **Projects Section Styling:** May need to adjust `FeaturedProjectCard` colors for dark background

---

## References

- **Design Tokens:** `/docs/STYLING.md`
- **Homepage Redesign:** `/docs/plans/HOMEPAGE_NAVBAR_REDESIGN.md`
- **Current Implementation:** `/frontend/src/pages/AboutUs.tsx`
- **Strapi API:** Members endpoint with `componentRolesArr` for role data
