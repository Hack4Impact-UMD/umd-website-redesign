# STYLING.md - Design System Documentation

This document defines the design tokens and styling conventions for the Hack4Impact UMD website redesign. It serves as the source of truth for colors, typography, and component styling.

**Tech Stack:** Tailwind CSS + shadcn/ui + CSS Variables

---

## Table of Contents

1. [Color Tokens](#color-tokens)
2. [Typography Tokens](#typography-tokens)
3. [CSS Variable Mapping](#css-variable-mapping)
4. [Usage Guidelines](#usage-guidelines)
5. [Migration Notes](#migration-notes)

---

## Color Tokens

### Backgrounds

| Token | Value | Usage |
|-------|-------|-------|
| `color-bg-default` | `#F9FAFB` | Page background |
| `color-bg-surface` | `#FFFFFF` | Cards, sections |
| `color-bg-muted` | `#F1F3F5` | Subtle section backgrounds |
| `color-bg-inverse` | `#0F172A` | Footer / dark structural surfaces |

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `color-text-primary` | `#333333` | Default body text |
| `color-text-secondary` | `#4B5563` | Secondary text |
| `color-text-muted` | `#6B7280` | Helper / meta text |
| `color-text-inverse` | `#FFFFFF` | Text on dark backgrounds |
| `color-text-link` | `#0069CA` | Inline links |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `color-brand-primary` | `#0D56A3` | Primary filled CTA (default) |
| `color-brand-primarySubtle` | `#E6F0FA` | Subtle brand backgrounds |
| `color-brand-onPrimary` | `#FFFFFF` | Text on primary CTA |
| `color-brand-secondary` | `#FFFFFF` | Secondary button background |
| `color-brand-onSecondary` | `#0069CA` | Text / border for outline buttons |
| `color-brand-accent` | `#0069CA` | Accent color |

### Borders & Focus Rings

| Token | Value | Usage |
|-------|-------|-------|
| `color-border-default` | `#E5E7EB` | Default borders / dividers |
| `color-border-muted` | `#D1D5DB` | Subtle borders |
| `color-ring-focus` | `#0069CA` | Focus ring |
| `color-ring-focusOffset` | `#FFFFFF` | Focus ring offset |

### States

| Token | Value | Usage |
|-------|-------|-------|
| `color-state-inverse-hover` | `#FFFFFF` (8% opacity) | Hover state for inverse button |
| `color-state-inverse-active` | `#FFFFFF` (16% opacity) | Active / pressed inverse button |
| `color-state-secondary-hover` | `#E6F0FA` | Hover state for secondary button |
| `color-state-secondary-active` | `#D2E6F7` | Pressed secondary button |
| `color-state-primary-hover` | `#004785` | Hover state for primary CTA |
| `color-state-primary-active` | `#003563` | Active / pressed CTA |
| `color-state-success` | `#15803D` | Success messages |
| `color-state-successSubtle` | `#ECFDF3` | Success background |
| `color-state-warning` | `#B48C0B` | Warning messages |
| `color-state-error` | `#B91C1C` | Error messages |
| `color-state-errorSubtle` | `#FEF2F2` | Error background |
| `color-state-info` | `#0069CA` | Informational messages |
| `color-state-onState` | `#FFFFFF` | Text on state backgrounds |

---

## Typography Tokens

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `font-heading` | `'Karla', sans-serif` | Display, H1, H2, H3, Label |
| `font-body` | `'Rubik', sans-serif` | Body, BodySmall, Caption |

### Sizes

| Token | Value | Usage |
|-------|-------|-------|
| `type-size-display` | `48px` | Titles |
| `type-size-h1` | `36px` | Headings |
| `type-size-h2` | `28px` | Subheadings |
| `type-size-h3` | `22px` | Section headers |
| `type-size-body` | `18px` | Body text |
| `type-size-bodySmall` | `16px` | Small body text |
| `type-size-label` | `16px` | Form labels |
| `type-size-caption` | `14px` | Image captions |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `type-line-display` | `56px` | Display text |
| `type-line-h1` | `44px` | H1 |
| `type-line-h2` | `36px` | H2 |
| `type-line-h3` | `30px` | H3 |
| `type-line-body` | `24px` | Body text |
| `type-line-bodySmall` | `20px` | Small body text |
| `type-line-label` | `20px` | Labels |
| `type-line-caption` | `16px` | Captions |

### Weights

| Token | Value | Usage |
|-------|-------|-------|
| `type-weight-regular` | `400` | Body, BodySmall, Caption |
| `type-weight-bold` | `700` | Display, H1, H2, H3, Label |

### Tracking (Letter Spacing)

| Token | Value | Usage |
|-------|-------|-------|
| `type-tracking-tight` | `-0.01em` | Display, H1 |
| `type-tracking-normal` | `0` | H2, H3, Body |
| `type-tracking-wide` | `0.02em` | BodySmall, Label |

---

## CSS Variable Mapping

These tokens map to shadcn/ui theme CSS variables. Add to `/frontend/src/index.css`:

```css
@layer base {
  :root {
    /* Backgrounds */
    --background: 249 250 251;           /* #F9FAFB - color-bg-default */
    --card: 255 255 255;                 /* #FFFFFF - color-bg-surface */
    --muted: 241 243 245;                /* #F1F3F5 - color-bg-muted */
    --popover: 255 255 255;              /* #FFFFFF - color-bg-surface */

    /* Text */
    --foreground: 51 51 51;              /* #333333 - color-text-primary */
    --muted-foreground: 107 114 128;     /* #6B7280 - color-text-muted */
    --card-foreground: 51 51 51;         /* #333333 - color-text-primary */
    --popover-foreground: 51 51 51;      /* #333333 - color-text-primary */

    /* Brand / Primary */
    --primary: 13 86 163;                /* #0D56A3 - color-brand-primary */
    --primary-foreground: 255 255 255;   /* #FFFFFF - color-brand-onPrimary */

    /* Secondary */
    --secondary: 255 255 255;            /* #FFFFFF - color-brand-secondary */
    --secondary-foreground: 0 105 202;   /* #0069CA - color-brand-onSecondary */

    /* Accent */
    --accent: 230 240 250;               /* #E6F0FA - color-brand-primarySubtle */
    --accent-foreground: 13 86 163;      /* #0D56A3 - color-brand-primary */

    /* Borders */
    --border: 229 231 235;               /* #E5E7EB - color-border-default */
    --input: 209 213 219;                /* #D1D5DB - color-border-muted */
    --ring: 0 105 202;                   /* #0069CA - color-ring-focus */

    /* Destructive / Error */
    --destructive: 185 28 28;            /* #B91C1C - color-state-error */
    --destructive-foreground: 255 255 255;

    /* Radius */
    --radius: 0.5rem;
  }

  .dark {
    /* Inverse / Dark Mode */
    --background: 15 23 42;              /* #0F172A - color-bg-inverse */
    --foreground: 255 255 255;           /* #FFFFFF - color-text-inverse */
    --card: 30 41 59;
    --card-foreground: 255 255 255;
    --muted: 51 65 85;
    --muted-foreground: 148 163 184;
    --primary: 0 105 202;                /* #0069CA - color-brand-accent */
    --primary-foreground: 255 255 255;
    --border: 51 65 85;
    --input: 51 65 85;
  }
}
```

---

## Usage Guidelines

### Using Tailwind Classes

shadcn/ui components use these CSS variables via Tailwind:

```tsx
// Backgrounds
<div className="bg-background" />        {/* Page background */}
<div className="bg-card" />              {/* Card/surface background */}
<div className="bg-muted" />             {/* Subtle background */}
<div className="bg-primary" />           {/* Brand primary background */}

// Text
<p className="text-foreground" />        {/* Primary text */}
<p className="text-muted-foreground" />  {/* Muted/helper text */}
<p className="text-primary" />           {/* Brand-colored text */}

// Borders
<div className="border-border" />        {/* Default border */}
<div className="border-input" />         {/* Form input border */}
<div className="ring-ring" />            {/* Focus ring */}
```

### Custom H4I Colors (Tailwind Config)

For direct brand color access beyond shadcn variables:

```tsx
<div className="bg-h4i-blue" />          {/* #0069CA */}
<div className="bg-h4i-blue-light" />    {/* #C2E0FB */}
<div className="text-h4i-mint" />        {/* #80D2C8 */}
```

### Typography Classes

Apply typography tokens with Tailwind:

```tsx
// Display (48px, bold, tight tracking)
<h1 className="font-heading text-5xl font-bold tracking-tight" />

// H1 (36px, bold, tight tracking)
<h1 className="font-heading text-4xl font-bold tracking-tight" />

// H2 (28px, bold, normal tracking)
<h2 className="font-heading text-3xl font-bold" />

// H3 (22px, bold, normal tracking)
<h3 className="font-heading text-xl font-bold" />

// Body (18px, regular, normal tracking)
<p className="font-body text-lg" />

// Body Small (16px, regular, wide tracking)
<p className="font-body text-base tracking-wide" />

// Caption (14px, regular, normal tracking)
<span className="font-body text-sm" />
```

### Component Examples

**Primary Button:**
```tsx
<Button className="bg-primary text-primary-foreground hover:bg-[#004785] active:bg-[#003563]">
  Apply Now
</Button>
```

**Secondary/Outline Button:**
```tsx
<Button variant="outline" className="border-primary text-primary hover:bg-accent">
  Learn More
</Button>
```

**Card:**
```tsx
<Card className="bg-card border-border">
  <CardHeader>
    <CardTitle className="font-heading text-foreground">Title</CardTitle>
  </CardHeader>
  <CardContent className="text-muted-foreground">
    Content here
  </CardContent>
</Card>
```

**Form Input:**
```tsx
<Input
  className="border-input focus:ring-ring focus:ring-2"
  placeholder="Enter email"
/>
```

---

## Migration Notes

### From Old CSS Modules

When migrating existing components from CSS Modules to the new design system:

| Old Pattern | New Pattern |
|-------------|-------------|
| `color: #333333` | `className="text-foreground"` |
| `color: #657788` | `className="text-muted-foreground"` |
| `background: #FFFFFF` | `className="bg-card"` |
| `background: #0069CA` | `className="bg-primary"` |
| `border: 1px solid #E5E7EB` | `className="border border-border"` |
| `font-family: 'Karla'` | `className="font-heading"` |
| `font-family: 'Rubik'` | `className="font-body"` |

### State Colors

For interactive states, use hover/active modifiers:

```tsx
// Primary button states
className="bg-primary hover:bg-[#004785] active:bg-[#003563]"

// Secondary button states
className="bg-secondary hover:bg-[#E6F0FA] active:bg-[#D2E6F7]"
```

### Status Messages

For alerts and notifications:

```tsx
// Success
<div className="bg-[#ECFDF3] text-[#15803D]">Success message</div>

// Warning
<div className="bg-[#FEF3C7] text-[#B48C0B]">Warning message</div>

// Error
<div className="bg-[#FEF2F2] text-[#B91C1C]">Error message</div>

// Info
<div className="bg-[#E6F0FA] text-[#0069CA]">Info message</div>
```
