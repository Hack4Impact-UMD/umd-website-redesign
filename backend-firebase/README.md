# Firebase + FireCMS Backend

This directory contains the new backend stack for the site migration:

- `functions/`: Firebase Cloud Functions API (Strapi-compatible read endpoints + content endpoints)
- `cms/`: self-hosted FireCMS application

## Quick start

1. Install dependencies:

```bash
npm --prefix backend-firebase/functions install
npm --prefix backend-firebase/cms install
```

2. Configure environment files:

- `backend-firebase/functions/.env`
- `backend-firebase/cms/.env`

3. Start Firebase emulators:

```bash
cd backend-firebase
firebase emulators:start
```

4. Run the Functions build:

```bash
npm --prefix backend-firebase/functions run build
```

## CMS hosting (same Firebase project)

- Project: `umd-website-f3e79`
- CMS URL: `https://umd-website-f3e79.web.app`
- API base URL (unchanged): `https://us-central1-umd-website-f3e79.cloudfunctions.net`

Build and deploy the CMS manually:

```bash
npm --prefix backend-firebase/cms ci
npm --prefix backend-firebase/cms run build
cd backend-firebase
firebase deploy --only hosting --project umd-website-f3e79
```

The default Hosting root is temporarily dedicated to CMS in this branch-validation phase.

## CMS styling prerequisites

FireCMS styling requires Tailwind and the FireCMS UI stylesheet import in the CMS app:

- Vite plugin: `@tailwindcss/vite`
- CSS imports in `backend-firebase/cms/src/index.css`:
  - `@import "tailwindcss";`
  - `@import "@firecms/ui/index.css" layer(base);`
- Global stylesheet import in `backend-firebase/cms/src/main.tsx`:
  - `import "./index.css";`

## CMS auth requirements

Enable these providers in Firebase Auth for `umd-website-f3e79`:

- Google
- Email/Password

Authorized domains should include:

- `umd-website-f3e79.web.app`
- `umd-website-f3e79.firebaseapp.com`

## CMS role claims

- CMS access still requires Firebase custom claim `role` set to `admin` or `editor`.
- Claims should be assigned through your Firebase Admin workflow (outside this repo).
- After claims are changed, users must sign out/sign in again to refresh token claims.

## CMS relation editing (projects/members)

- Projects and members now use searchable reference pickers in FireCMS instead of raw ID arrays.
- Collection tables also show human-readable relation previews:
  - Projects table shows related members by name
  - Members table shows related projects by title
- Firestore storage remains unchanged for backend compatibility:
  - `projects.memberIds` is stored as `string[]`
  - `members.projectIds` is stored as `string[]`
- The CMS converts between UI references and stored IDs automatically:
  - `onFetch` hydrates references for editor UX
  - `onPreSave` normalizes references back to IDs
  - `onSaveSuccess` syncs reverse relations so both collections stay consistent
- Raw document IDs are intentionally hidden in project/member tables and forms.

## Relation troubleshooting

- If relation previews look stale after a deploy, hard refresh the browser and sign out/sign back in to refresh auth/session state.
- If a relation save appears one-sided, inspect `projects.memberIds` and `members.projectIds` in Firestore and correct mismatches before re-testing.
- If FireCMS shows reference-type errors, confirm relation fields are configured as reference arrays in `backend-firebase/cms/src/collections.ts` and that `onFetch`/`onPreSave` callbacks are active.

## Relation verification checklist

1. Open `https://umd-website-f3e79.web.app/c/projects` and confirm each row shows member previews.
2. Open `https://umd-website-f3e79.web.app/c/members` and confirm each row shows project previews.
3. Edit project members, save, then verify corresponding member documents include that project in `projectIds`.
4. Edit member projects, save, then verify corresponding project documents include that member in `memberIds`.
5. Confirm browser console does not show:
   - `Service firestore is not available`
   - `Reference preview received value of type string`
   - `Unexpected value. Click to edit`

## Security model

- Public website reads should go through Cloud Functions only.
- Firestore/Storage direct access is restricted to authenticated CMS users with `admin` or `editor` custom claims.

## Notes

- This migration defers newsletter backend integration.
- Content uses immediate-live updates (no draft/publish workflow).
- Migration scripts have been removed from the codebase after cutover to keep runtime maintenance minimal.

## Media handling

- Canonical Firestore format for CMS-managed media is a raw Storage path:
  - `projects/<projectId>/...`
  - `members/<memberId>/...`
  - `content/<collection>/<docId>/...`
- Functions normalize these values to web-consumable API paths (`/api/media/...`) in public responses.
- FireCMS image fields use native Storage uploads (not pasted URLs) with conservative resize settings.
- Legacy `/assets/...` content references were migrated once to `content/legacy/...` and rewritten in Firestore.
- One-time migration scripts were intentionally removed after execution to keep this codebase clean.
