# Firebase Functions and FireCMS

Firebase is already the deployed backend/CMS for the UMD website. This directory
brings its maintainable source onto `dev/redesign`; it does not migrate or seed
production data.

## Components

- `functions/`: read-only public API with Strapi-compatible project/member responses
- `cms/`: authenticated FireCMS application for admin/editor content management
- `firestore.rules` and `storage.rules`: direct CMS access controls
- `scripts/verify-live-contract.mjs`: unauthenticated, GET-only live parity check
- `scripts/plan-content-migration.mjs`: deterministic, file-based dry run for legacy content envelopes
- `SOURCE_PARITY.md`: captured baseline, intentional differences, and known uncertainty

The live project is `umd-website-f3e79`. Source config defines separate `cms`
and `public` Hosting targets. The proposed public site ID is
`umd-website-f3e79-public`; it has not been created, mapped, previewed, or
deployed. Netlify remains the public production host.

## Local setup

```bash
npm --prefix backend-firebase/functions ci
npm --prefix backend-firebase/cms ci
```

Copy the example environment files locally; never commit the resulting `.env`
files or service-account JSON. Emulator work must use a `demo-*` project ID.

```bash
cd backend-firebase
firebase emulators:start --project demo-umd-website
```

## Validation

```bash
npm --prefix backend-firebase/functions run lint
npm --prefix backend-firebase/functions test
npm --prefix backend-firebase/functions run build
npm --prefix backend-firebase/cms run lint
npm --prefix backend-firebase/cms test
npm --prefix backend-firebase/cms run build
```

Run mutation tests only against the emulator:

```bash
cd backend-firebase
npx firebase-tools@14.1.0 emulators:exec \
  --project demo-umd-website \
  --only firestore,storage \
  "npm --prefix functions run test:emulator"
npx firebase-tools@14.1.0 emulators:exec \
  --project demo-umd-website-relations \
  --config cms/tests/emulator/firebase.json \
  --only firestore \
  "npm --prefix cms run test:emulator"
```

Run the read-only live verification separately:

```bash
node backend-firebase/scripts/verify-live-contract.mjs
```

Legacy content must be reviewed before any production write. Export the six live
documents into a local JSON object keyed by `home`, `about`, `our-work`,
`apply/student`, `apply/nonprofit`, and `site-settings`, then generate a plan:

```bash
node backend-firebase/scripts/plan-content-migration.mjs legacy-content.json
node --test backend-firebase/scripts/content-migration.test.mjs
```

The planner writes only to stdout. It wraps root-level documents as
`placeholder`, clears verification, disables stale application campaigns, and
retains the known application/contact destinations for editor review. Malformed
modern envelopes are reported as `needs-review` and are never rewritten. Applying
that plan to production requires separate explicit authorization.

## Public API

- `GET /health` and `GET /api/health`
- `GET /projects` and `GET /api/projects`
- `GET /members` and `GET /api/members`
- `GET /content/:section` and `GET /api/content/:section`
- `GET /content/:section/:subsection` and its `/api` alias
- `GET /media/*` and `GET /api/media/*`

Collection responses retain the existing Strapi-compatible envelope. Supported
project filters are `isFeatured`, `isCurrentProject`, or `path`, one at a time.
The maximum page size is 250, preserving the existing page-size-200 consumer.

Public website reads go through Functions. Direct Firestore and Storage access
requires an authenticated Firebase user whose custom `role` claim is `admin` or
`editor`.

## CMS behavior

- Google and Email/Password providers must be enabled.
- Authorized domains include the CMS `.web.app` and `.firebaseapp.com` hosts.
- Project/member relation pickers store string IDs in `memberIds`/`projectIds`.
- Reverse relation updates use atomic array transforms and validate targets.
- Project/member deletion is disabled until reverse cleanup is implemented.
- Media uploads are restricted to images at or below 10 MB under `projects/`,
  `members/`, or `content/`.
- Every content document uses an atomic `mode`, `verifiedAt`, and `payload`
  envelope. `published` requires a complete valid payload and fresh verification;
  editing a published payload in FireCMS downgrades it to `placeholder` and clears
  verification. `placeholder` uses the complete local frontend default and
  `hidden` renders no page content. Legacy documents without the envelope are
  treated as placeholders.
- Newsletter integration remains deferred.

## Deployment gate

This PR performs no deployment. Merging it does not authorize deployment.

After a separate explicit approval, target resources individually—never use a
bare `firebase deploy` command:

```bash
cd backend-firebase
firebase deploy --only functions:api --project umd-website-f3e79
firebase deploy --only firestore:rules,storage --project umd-website-f3e79
firebase deploy --only hosting:cms --project umd-website-f3e79
```

The `public` target additionally requires an explicitly approved site creation
and target mapping before `firebase deploy --only hosting:public` can work. Do
not create or map it as an incidental development step.

Before any approved live deployment, capture the active Function revision,
Hosting release, rulesets, CORS configuration, and the live contract baseline so
each resource has a tested rollback path. Set `ALLOWED_ORIGINS` to the intended
exact website browser origins before deploying the Function. The source fails
fast during startup when this required production setting is absent, so a
misconfigured deployment cannot leave browser clients with a silently unusable
API.
