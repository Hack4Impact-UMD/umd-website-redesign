# Hack4Impact UMD frontend

The public site is a React 18 + TypeScript + Vite application. It reads projects,
members, shared site settings, and page content from the Firebase Function API.
The checked-in content defaults render immediately and are also used whenever a
Firebase content document is loading, hidden, legacy, invalid, or unavailable.

## Requirements

- Node.js 20
- npm
- Firebase CLI only when running emulators or performing an explicitly approved deployment

Install the frontend and Firebase workspaces from the repository root:

```bash
npm --prefix frontend ci
npm --prefix backend-firebase/functions ci
npm --prefix backend-firebase/cms ci
```

## Local development

The safest full local setup uses Firebase's `demo-*` emulator project and cannot
write to the live project:

```bash
cd backend-firebase
npx firebase-tools@14.1.0 emulators:start --project demo-umd-website
```

In another terminal:

```bash
npm --prefix frontend run dev
```

Vite runs at <http://localhost:3000> and proxies `/api/**` to the local Functions
emulator. `frontend/.env.example` documents the two optional overrides:

- `DEV_API_PROXY_URL` changes only the development proxy target.
- `VITE_API_URL` changes the browser API base. Leave it unset for same-origin `/api`.

Do not put Firebase Admin credentials or service-account JSON in the frontend.

## Validation

Run the complete frontend gate from the repository root:

```bash
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run test:e2e
```

Playwright starts its own Vite server and uses deterministic API fixtures; it
does not require live Firebase data. Read-only live API parity is checked with:

```bash
node backend-firebase/scripts/verify-live-contract.mjs
```

Backend and CMS validation commands are documented in
[`backend-firebase/README.md`](../backend-firebase/README.md).

## Firebase configuration

The live Firebase project is `umd-website-f3e79`. When a live Firebase CLI
operation has been explicitly approved, select both the project and the owning
account on every command:

```bash
--project umd-website-f3e79 --account umd-tech@hack4impact.org
```

The FireCMS production build requires all `VITE_FIREBASE_*` values listed in
`backend-firebase/cms/.env.example`. Before a Functions deployment,
`ALLOWED_ORIGINS` must contain the exact public website and CMS origins; the
source intentionally rejects browser origins that are not listed.

Netlify remains the public host and proxies `/api/**` to the Firebase Function.
Firebase Hosting currently maps only the `cms` target. The `public` target is
deliberately unmapped: creating a second Hosting site or mapping a public target
requires separate approval.

## Deployment safety

Building or merging does not authorize a deployment. After explicit approval,
deploy one tested resource at a time; never run a bare `firebase deploy`:

```bash
cd backend-firebase
firebase deploy --only functions:api --project umd-website-f3e79 --account umd-tech@hack4impact.org
firebase deploy --only firestore:rules,storage --project umd-website-f3e79 --account umd-tech@hack4impact.org
firebase deploy --only hosting:cms --project umd-website-f3e79 --account umd-tech@hack4impact.org
```

The public site deploys through its existing Netlify workflow. Do not run
`firebase deploy --only hosting:public` until a public Hosting site is explicitly
created, mapped, reviewed, and approved.
