# Frontend Migration Plan: CRA → Vite + React 18 + Tailwind + shadcn

## Overview
Full modernization of the Hack4Impact-UMD frontend, migrating from Create React App to Vite, upgrading React 17 to 18, replacing 35 CSS Module files with Tailwind CSS, and integrating shadcn/ui components.

---

## Phase 1: Vite Setup (Foundation)

### 1.1 Create Vite configuration files
- [ ] Create `frontend/vite.config.ts` with React plugin, SVGR plugin, path aliases
- [ ] Create `frontend/tsconfig.node.json` for Vite config typing

### 1.2 Update package.json
- [ ] Remove `react-scripts` dependency
- [ ] Add `vite` dependency
- [ ] Add `@vitejs/plugin-react` dependency
- [ ] Add `vite-plugin-svgr` dependency
- [ ] Update `react` to `^18.2.0`
- [ ] Update `react-dom` to `^18.2.0`
- [ ] Update `@types/react` to `^18.2.0`
- [ ] Update `@types/react-dom` to `^18.2.0`
- [ ] Update scripts: `"dev": "vite"`, `"build": "tsc && vite build"`, `"preview": "vite preview"`

### 1.3 Update tsconfig.json
- [ ] Change `target` to `ES2020`
- [ ] Change `module` to `ESNext`
- [ ] Change `moduleResolution` to `bundler`
- [ ] Add `baseUrl: "."`
- [ ] Add path alias: `"@/*": ["./src/*"]`
- [ ] Add reference to `tsconfig.node.json`

### 1.4 Move and update index.html
- [ ] Move `public/index.html` → `frontend/index.html`
- [ ] Remove all `%PUBLIC_URL%` references
- [ ] Add Vite entry script: `<script type="module" src="/src/main.tsx"></script>`
- [ ] Update Google Fonts link to use proper format

### 1.5 Environment variables migration
- [ ] Rename `.env` variables from `REACT_APP_*` to `VITE_*`
- [ ] Update `src/pages/NonprofitApply.tsx` - change `process.env.REACT_APP_ROOT_URL` → `import.meta.env.VITE_ROOT_URL`
- [ ] Update `src/pages/ProjectPage.tsx` - change `process.env.REACT_APP_ROOT_URL` → `import.meta.env.VITE_ROOT_URL`
- [ ] Update `src/pages/AboutUs.tsx` - change `process.env.REACT_APP_ROOT_URL` → `import.meta.env.VITE_ROOT_URL`
- [ ] Update `src/components/projects/Projects.tsx` - change `process.env.REACT_APP_ROOT_URL` → `import.meta.env.VITE_ROOT_URL`
- [ ] Update `src/components/our_work/PastProjects.tsx` - change `process.env.REACT_APP_ROOT_URL` → `import.meta.env.VITE_ROOT_URL`

### 1.6 Rename entry point
- [ ] Rename `src/index.tsx` → `src/main.tsx`
- [ ] Create `src/vite-env.d.ts` with Vite type declarations and env interface

### 1.7 Verification Checkpoint
- [ ] Run `npm install` (with `--legacy-peer-deps` if needed)
- [ ] Run `npm run dev` - app should start

---

## Phase 2: React 18 Upgrade

### 2.1 Update React entry point
- [ ] Update `src/main.tsx` to use `ReactDOM.createRoot()` instead of `ReactDOM.render()`
- [ ] Wrap App in `<React.StrictMode>`

### 2.2 Convert FaqRow class component to functional
- [ ] Open `src/components/apply/Faq.tsx`
- [ ] Convert `FaqRow` from `React.Component` to functional component
- [ ] Replace `this.state` with `useState` hook
- [ ] Remove constructor and bind methods

### 2.3 Remove Bootstrap
- [ ] Remove `import 'bootstrap/dist/css/bootstrap.min.css'` from `App.tsx`
- [ ] Remove `bootstrap` from package.json dependencies
- [ ] Remove `react-bootstrap` from package.json dependencies

### 2.4 Verification Checkpoint
- [ ] Run `npm run dev` - app should run without React warnings
- [ ] Verify no console errors related to React 18

---

## Phase 3: Tailwind CSS Setup

### 3.1 Install Tailwind
- [ ] Run `npm install -D tailwindcss postcss autoprefixer`
- [ ] Run `npm install -D tailwindcss-animate`
- [ ] Run `npx tailwindcss init -p`

### 3.2 Configure tailwind.config.js
- [ ] Add content paths: `"./index.html"`, `"./src/**/*.{js,ts,jsx,tsx}"`
- [ ] Add custom font families: `karla`, `rubik`
- [ ] Add H4I brand colors:
  - [ ] `h4i-blue: '#0069CA'`
  - [ ] `h4i-blue-light: '#C2E0FB'`
  - [ ] `h4i-mint: '#80D2C8'`
  - [ ] `h4i-mint-light: '#CBF9F3'`
  - [ ] `h4i-black: '#333333'`
  - [ ] `h4i-gray: '#657788'`
  - [ ] `h4i-coral: '#F2594B'`
- [ ] Add custom screen breakpoint: `'nav': '1000px'`
- [ ] Add `tailwindcss-animate` plugin

### 3.3 Create global CSS with Tailwind
- [ ] Replace `src/index.css` with Tailwind directives (`@tailwind base/components/utilities`)
- [ ] Add base layer styles for `body`, `h1`, `h2`, `h3`, `p` typography
- [ ] Import Google Fonts via `@import`

### 3.4 Update imports
- [ ] Remove `import './App.css'` from `App.tsx`
- [ ] Ensure `import './index.css'` is in `main.tsx`

### 3.5 Verification Checkpoint
- [ ] Run `npm run dev` - typography should render correctly
- [ ] Verify Tailwind classes work (test with a simple class)

---

## Phase 4: shadcn/ui Integration

### 4.1 Initialize shadcn
- [ ] Run `npx shadcn@latest init`
- [ ] Select TypeScript: Yes
- [ ] Select style: Default
- [ ] Configure components path: `src/components/ui`
- [ ] Configure utils path: `src/lib/utils`

### 4.2 Install core shadcn components
- [ ] Run `npx shadcn@latest add button`
- [ ] Run `npx shadcn@latest add card`
- [ ] Run `npx shadcn@latest add accordion`
- [ ] Run `npx shadcn@latest add input`
- [ ] Run `npx shadcn@latest add form`
- [ ] Run `npx shadcn@latest add navigation-menu`
- [ ] Run `npx shadcn@latest add dialog`
- [ ] Run `npx shadcn@latest add textarea`

### 4.3 Customize shadcn theme
- [ ] Update CSS variables in `src/index.css` for H4I brand:
  - [ ] `--primary: 207 100% 40%` (H4I blue)
  - [ ] `--secondary: 171 42% 66%` (H4I mint)
  - [ ] `--foreground: 0 0% 20%` (H4I black)
  - [ ] `--destructive: 8 88% 62%` (H4I coral)

### 4.4 Verification Checkpoint
- [ ] Import and render a shadcn Button to test
- [ ] Verify shadcn components render correctly

---

## Phase 5: Component Migration

### 5.1 Button Components
- [ ] Create `src/components/ui/h4i-button.tsx` wrapper component
- [ ] Update `src/components/buttons/StandardButton.tsx` to use shadcn Button
- [ ] Update `src/components/buttons/BlueButton.tsx` or remove (use h4i-button variant)
- [ ] Update `src/components/buttons/GreenButton.tsx` or remove (use h4i-button variant)
- [ ] Update `src/components/buttons/CustomButtonComponent.tsx` to use shadcn Button
- [ ] Update all files importing StandardButton/BlueButton/GreenButton

### 5.2 ScrollToTopButton
- [ ] Rewrite `src/components/buttons/ScrollToTopButton.tsx` with Tailwind + shadcn Button
- [ ] Use `lucide-react` ArrowUp icon instead of SVG import
- [ ] Add proper scroll event listener with cleanup

### 5.3 Card Components
- [ ] Update `src/components/home_page/FeaturedProjectCard.tsx` to use shadcn Card
- [ ] Update `src/components/our_work/PastProjectCard.tsx` to use shadcn Card
- [ ] Update `src/components/about_us/ValueCard.tsx` to use shadcn Card with hover effects
- [ ] Update `src/components/apply/RoleCard.tsx` to use shadcn Card

### 5.4 FAQ/Accordion
- [ ] Rewrite `src/components/apply/Faq.tsx` to use shadcn Accordion
- [ ] Remove FaqRow component (integrated into Accordion)
- [ ] Update `src/pages/StudentApply.tsx` FAQ usage
- [ ] Update `src/pages/NonprofitApply.tsx` FAQ usage (if applicable)

### 5.5 Contact Form
- [ ] Update `src/pages/ContactPage.tsx` to use shadcn Form + Input + Textarea
- [ ] Add `zod` for form validation
- [ ] Add `@hookform/resolvers` for react-hook-form + zod integration
- [ ] Update form styling with Tailwind classes

### 5.6 Navbar
- [ ] Rewrite `src/components/navbar/Navbar.tsx` with shadcn NavigationMenu
- [ ] Implement mobile hamburger menu with Tailwind
- [ ] Update `src/components/navbar/MenuItems.tsx` or remove (integrate into Navbar)
- [ ] Add Apply dropdown menu functionality
- [ ] Style with gradient background using Tailwind

### 5.7 Footer
- [ ] Rewrite `src/components/footer/Footer.tsx` with Tailwind classes
- [ ] Use `lucide-react` icons for social links
- [ ] Update background image handling

### 5.8 Layout Components
- [ ] Update `src/components/home_page/HomePageTop.tsx` with Tailwind
- [ ] Update `src/components/home_page/HomePageLower.tsx` with Tailwind
- [ ] Update `src/components/home_page/Supporters.tsx` with Tailwind
- [ ] Update `src/components/our_work/OurWorkHeader.tsx` with Tailwind
- [ ] Update `src/components/projects/Projects.tsx` with Tailwind
- [ ] Update `src/components/projects/ProjectsTop.tsx` with Tailwind

### 5.9 Page Components
- [ ] Update `src/pages/Home.tsx` with Tailwind
- [ ] Update `src/pages/AboutUs.tsx` with Tailwind
- [ ] Update `src/pages/OurWork.tsx` with Tailwind
- [ ] Update `src/pages/ProjectPage.tsx` with Tailwind
- [ ] Update `src/pages/StudentApply.tsx` with Tailwind
- [ ] Update `src/pages/NonprofitApply.tsx` with Tailwind
- [ ] Update `src/pages/PageNotFound.tsx` with Tailwind

### 5.10 Utility Components
- [ ] Update `src/components/LoadingSpinner.tsx` with Tailwind animation
- [ ] Update `src/components/Person.tsx` with Tailwind
- [ ] Update `src/components/apply/StudentNonprofitSelector.tsx` with Tailwind

---

## Phase 6: Cleanup

### 6.1 Update SVG imports for Vite
- [ ] Find all `import { ReactComponent as X } from '*.svg'` patterns
- [ ] Change to `import X from '*.svg?react'` pattern
- [ ] Files to check:
  - [ ] `src/components/footer/Footer.tsx`
  - [ ] `src/components/apply/Faq.tsx`
  - [ ] `src/components/navbar/Navbar.tsx`
  - [ ] `src/components/buttons/ScrollToTopButton.tsx`
  - [ ] Any other files with SVG ReactComponent imports

### 6.2 Delete CSS Module files
- [ ] Delete `src/styles/about_us/AboutUs.module.css`
- [ ] Delete `src/styles/about_us/ValueCard.module.css`
- [ ] Delete `src/styles/apply/ApplyButton.module.css`
- [ ] Delete `src/styles/apply/Faq.module.css`
- [ ] Delete `src/styles/apply/NonprofitApply.module.css`
- [ ] Delete `src/styles/apply/RoleCard.module.css`
- [ ] Delete `src/styles/apply/StudentApply.module.css`
- [ ] Delete `src/styles/apply/StudentNonprofitSelector.module.css`
- [ ] Delete `src/styles/buttons/ScrollToTopButton.module.css`
- [ ] Delete `src/styles/buttons/StandardButton.module.css`
- [ ] Delete `src/styles/contact/Contact.module.css`
- [ ] Delete `src/styles/contact/MessageSent.module.css`
- [ ] Delete `src/styles/footer/Footer.module.css`
- [ ] Delete `src/styles/home/FeaturedProjectCard.module.css`
- [ ] Delete `src/styles/home/FeaturedProjects.module.css`
- [ ] Delete `src/styles/home/Home.module.css`
- [ ] Delete `src/styles/home/HomePage.module.css`
- [ ] Delete `src/styles/home/HomePageLower.module.css`
- [ ] Delete `src/styles/home/HomePageTop.module.css`
- [ ] Delete `src/styles/home/Supporters.module.css`
- [ ] Delete `src/styles/navbar/Navbar.module.css`
- [ ] Delete `src/styles/our_work/CurrentProjects.module.css`
- [ ] Delete `src/styles/our_work/FeaturedProjectCard.module.css`
- [ ] Delete `src/styles/our_work/OurWork.module.css`
- [ ] Delete `src/styles/our_work/OurWorkHeader.module.css`
- [ ] Delete `src/styles/our_work/PastProjectCard.module.css`
- [ ] Delete `src/styles/our_work/PastProjects.module.css`
- [ ] Delete `src/styles/our_work/ProjectCard.module.css`
- [ ] Delete `src/styles/people/Person.module.css`
- [ ] Delete `src/styles/projects/Projects.module.css`
- [ ] Delete `src/styles/projects/ProjectsPage.module.css`
- [ ] Delete `src/styles/projects/ProjectsTop.module.css`
- [ ] Delete `src/styles/LoadingSpinner.module.css`
- [ ] Delete `src/styles/PageNotFound.module.css`
- [ ] Delete `src/App.css`
- [ ] Delete `src/styles/` directory (if empty)

### 6.3 Remove unused files
- [ ] Delete `src/typings.d.ts` (CSS module types no longer needed)
- [ ] Delete `src/react-app-env.d.ts` (CRA specific)
- [ ] Delete `src/reportWebVitals.ts` (if exists, CRA specific)
- [ ] Delete `src/setupTests.ts` (if exists, will recreate for Vitest later)

### 6.4 Clean up dependencies
- [ ] Remove `bootstrap` from package.json
- [ ] Remove `react-bootstrap` from package.json
- [ ] Remove `web-vitals` from package.json (optional, CRA specific)
- [ ] Run `npm install` to clean up package-lock.json

---

## Phase 7: Deployment Configuration

### 7.1 Update netlify.toml
- [ ] Update `publish` directory if using Vite default (`dist` instead of `build`)
  - OR configure Vite to output to `build`
- [ ] Add `NODE_VERSION = "18"` to build environment
- [ ] Verify redirect rule for SPA routing

### 7.2 Update environment variables
- [ ] In Netlify dashboard: rename `REACT_APP_ROOT_URL` → `VITE_ROOT_URL`
- [ ] Verify any other env vars are updated

### 7.3 Update .gitignore
- [ ] Ensure `dist/` is ignored (Vite default output)
- [ ] Keep `build/` ignored if still using that directory

---

## Phase 8: Testing & Verification

### 8.1 Development Testing
- [ ] Run `npm run dev` - dev server starts without errors
- [ ] All routes load correctly:
  - [ ] `/` (Home)
  - [ ] `/aboutus`
  - [ ] `/ourwork`
  - [ ] `/ourwork/[project-slug]` (dynamic project pages)
  - [ ] `/apply/student`
  - [ ] `/apply/nonprofit`
  - [ ] `/contactus`
- [ ] Navbar hamburger menu works on mobile viewport
- [ ] Navbar Apply dropdown works on desktop
- [ ] Scroll-to-top button appears and functions
- [ ] FAQ accordion expands/collapses

### 8.2 Data Fetching
- [ ] Projects load on homepage (Featured Projects section)
- [ ] Projects load on /ourwork page
- [ ] Individual project pages load with correct data
- [ ] Team members load on /aboutus page

### 8.3 Forms
- [ ] Contact form validation works
- [ ] Contact form submission sends email via EmailJS
- [ ] Success message displays after submission

### 8.4 Responsive Design
- [ ] Test at 375px (mobile)
- [ ] Test at 768px (tablet)
- [ ] Test at 1024px (desktop)
- [ ] Test at 1440px (wide desktop)

### 8.5 Visual Verification
- [ ] Fonts render correctly (Karla for headings, Rubik for body)
- [ ] Brand colors display correctly
- [ ] Card hover effects work
- [ ] Gradient backgrounds display correctly
- [ ] Images load properly

### 8.6 Production Build
- [ ] Run `npm run build` - build completes without errors
- [ ] Run `npm run preview` - preview production build locally
- [ ] Verify all functionality works in production build

### 8.7 Deployment
- [ ] Push to branch and verify Netlify build succeeds
- [ ] Test deployed site functionality
- [ ] Verify all API calls work in production

---

## Final Dependencies Reference

### Dependencies to ADD:
```
@hookform/resolvers
@radix-ui/react-accordion
@radix-ui/react-dialog
@radix-ui/react-navigation-menu
@radix-ui/react-slot
class-variance-authority
clsx
lucide-react
tailwind-merge
tailwindcss-animate
zod
```

### Dependencies to UPDATE:
```
react: ^18.2.0
react-dom: ^18.2.0
@types/react: ^18.2.0
@types/react-dom: ^18.2.0
```

### Dependencies to REMOVE:
```
react-scripts
bootstrap
react-bootstrap
web-vitals (optional)
```

### Dev Dependencies to ADD:
```
vite
@vitejs/plugin-react
vite-plugin-svgr
tailwindcss
postcss
autoprefixer
```

---

## Notes

- Always use `--legacy-peer-deps` flag for npm install if dependency conflicts occur
- Create a new git branch for this migration: `feature/vite-tailwind-migration`
- Commit after each phase completion for easy rollback
- Keep CSS Modules working during transition (Vite supports them natively)
- Test frequently during component migration
