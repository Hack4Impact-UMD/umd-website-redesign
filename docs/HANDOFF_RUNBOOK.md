# Website redesign handoff runbook

This is the repository-owned operating guide for the Hack4Impact UMD website
redesign. It covers the target `dev/redesign` stack and the transition from the
older production build. Provider state below was verified on 2026-07-31 and can
drift; re-check the relevant provider before a release or access change.

Do not put passwords, service-account keys, API tokens, recovery codes, or
literal secret values in this repository. Use individual accounts, organization
teams, and provider invitations. Never share a personal login.

## Architecture and ownership surfaces

| Surface | Production or target state | Source of truth |
| --- | --- | --- |
| GitHub | Public repository `Hack4Impact-UMD/umd-website-redesign`. `main` is the default branch; the redesign is developed on `dev/redesign`. GitHub Actions run CI only. | Repository settings and `.github/workflows/` |
| Public hosting | Netlify serves `https://umd.hack4impact.org`. Treat the site attached to that custom domain as the production source of truth. | Netlify site settings and `netlify.toml` |
| DNS and domain | Namecheap is the registrar for `hack4impact.org`; Cloudflare nameservers and proxying serve `umd.hack4impact.org`. The parent organization owns this surface, not this repository. | Namecheap registration and the Cloudflare account that contains the `hack4impact.org` zone |
| Firebase and Google Cloud | Project `umd-website-f3e79` contains Firebase Auth, Firestore, Storage, the `api` Function in `us-central1`, and the CMS Hosting site. | Firebase console, Google Cloud IAM, and `backend-firebase/` |
| CMS | FireCMS is a library deployed on Firebase Hosting at `https://umd-website-f3e79.web.app`; there is no separate FireCMS SaaS account to transfer. | Firebase Auth custom claims, Firestore/Storage rules, and `backend-firebase/cms/` |
| Billing | Billing ownership is intentionally separate from normal content and code maintenance. | Google Cloud Billing |
| Legacy backend | `backend/` is historical Strapi/Cloudinary/Heroku source. The configured Heroku app was no longer present at the audited URL. Do not deploy this directory as part of the redesign. | `backend/` and the retired Heroku app record |
| Analytics, forms, and email | No active analytics SDK, form processor, or application email service was found in the redesign. Newsletter and application destinations are CMS-managed outbound links; contact links use `mailto:`. | `frontend/` and CMS content documents |

Do not infer that a merge or Firebase deployment has updated the public site;
verify the Netlify published deploy and the served bundle separately.

## Maintainer access model

Use the lowest role that supports the operation:

- GitHub maintainers: repository `maintain`. Reserve repository administration
  for the organization account responsible for access continuity.
- Firebase maintainers: `Firebase Develop Admin` at the project level. Use the
  shared organization account for deployment operations that require additional
  service-account or IAM authority.
- CMS editors: Firebase Auth custom claim `role=editor`. The application currently
  gives `admin` and `editor` the same CMS and rules access, so `editor` is the
  least-privilege choice.
- Netlify: site-scoped developer access when the plan supports it. A central
  team owner should remain responsible for membership and billing; do
  not grant billing ownership solely to deploy the site.
- Cloudflare: zone-scoped DNS access to `hack4impact.org`, without account billing
  or super-administrator privileges.
- Namecheap and Google Cloud Billing: keep registrar renewal and billing with a
  central organization owner. Maintainers need a documented escalation route,
  not shared credentials.

## Complete CMS onboarding

1. Each approved editor opens `https://umd-website-f3e79.web.app` and selects
   **Sign in with Google** using their organization email. The first attempt may
   show an access error; it also creates the Firebase Auth user needed for the
   next step.
2. An already-authorized Firebase operator verifies that exactly one Auth user
   matches the intended email, preserves all existing custom claims, and sets
   only `role` to `editor`.
3. The new editor signs out and back in so Firebase issues a fresh ID token.
4. Verify that the collection list loads and that a harmless draft edit can be
   saved and reverted. Do not use a project/member delete as a test; those
   deletes are intentionally blocked.

An authorized operator can make the exact-target claim change from Google Cloud
Shell without downloading a service-account key. Run this in a temporary empty
directory after setting `CMS_EMAIL` to one of the approved identities:

```bash
export CMS_EMAIL='approved-maintainer@example.org'
npm install --no-save firebase-admin@12.7.0
node --input-type=module <<'NODE'
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const projectId = "umd-website-f3e79";
const email = process.env.CMS_EMAIL;
if (!email) throw new Error("CMS_EMAIL is required");

initializeApp({ credential: applicationDefault(), projectId });
const auth = getAuth();
const before = await auth.getUserByEmail(email);
await auth.setCustomUserClaims(before.uid, {
  ...(before.customClaims ?? {}),
  role: "editor",
});
const after = await auth.getUser(before.uid);
if (after.customClaims?.role !== "editor") {
  throw new Error("CMS role verification failed");
}
console.log(JSON.stringify({ email: after.email, role: after.customClaims.role }));
NODE
```

Remove the temporary directory after verification. Do not print access tokens,
claim payloads unrelated to `role`, or user identifiers into tickets or chat.

## Routine content operations

- Open the CMS Hosting URL and use the `Projects`, `Members`, or `Content: ...`
  collections.
- Project/member relations are synchronized in both directions. A surfaced
  post-save relation error must be resolved before making unrelated edits.
- Project and member deletion is disabled until reverse-relation cleanup is
  implemented.
- Upload only images up to 10 MB under `projects/`, `members/`, or `content/`.
- Content pages use one atomic `mode`, `verifiedAt`, and `payload` envelope.
  `published` requires a complete payload and fresh verification. Editing a
  published payload intentionally downgrades it to `placeholder` until it is
  reviewed and republished.
- Newsletter, application, and contact destinations are content fields or
  outbound links. There is no in-repository subscriber database or mail send.

## Local development and validation

Install and validate each workspace independently:

```bash
npm --prefix frontend ci
npm --prefix backend-firebase/functions ci
npm --prefix backend-firebase/cms ci

npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix backend-firebase/functions run lint
npm --prefix backend-firebase/functions test
npm --prefix backend-firebase/functions run build
npm --prefix backend-firebase/cms run lint
npm --prefix backend-firebase/cms test
npm --prefix backend-firebase/cms run build
```

Use only a `demo-*` project for mutation tests and emulators. Never point a local
emulator or test suite at production. Environment variable names are documented
in the checked-in `.env.example` files; their values belong in ignored local
files or the provider's encrypted configuration.

The GET-only production verifier is safe to run without credentials:

```bash
node backend-firebase/scripts/verify-live-contract.mjs
```

The 2026-07-31 baseline was 32 projects, 212 members, six content sections, and
readable media, with the checksums recorded in `backend-firebase/SOURCE_PARITY.md`.

## Release procedure

### Pull request and public site

1. Branch from `dev/redesign`, open a pull request back to `dev/redesign`, and
   require the relevant GitHub Actions checks and one maintainer review.
2. Verify the Netlify deploy preview. If more than one connected site exists,
   treat only the site attached to `umd.hack4impact.org` as production.
3. Before cutover, confirm the primary site's repository, production branch,
   build base (`frontend`), command, publish directory, `/api/*` proxy, and custom
   domain match `netlify.toml`.
4. Publish from the primary Netlify site, then verify a cache-busted load of each
   route and `/api/health`. Confirm the published commit in Netlify rather than
   relying on the GitHub merge state.
5. If a redundant connected site exists, an authorized Netlify owner may archive
   it only after confirming it owns no required domain, environment setting, or
   deploy hook. This cleanup is a separate destructive action and is not
   authorized by this runbook.

### Firebase resources

A merge does not authorize a live Firebase deployment. Capture the current
Function revision, Hosting release, rulesets, and live contract baseline first.
Set `ALLOWED_ORIGINS` to the exact intended browser origins before deploying the
Function. Deploy one resource class at a time from `backend-firebase/`:

```bash
firebase deploy --only functions:api --project umd-website-f3e79
firebase deploy --only firestore:rules,storage --project umd-website-f3e79
firebase deploy --only hosting:cms --project umd-website-f3e79
```

Never use bare `firebase deploy`. The configured `public` Hosting target is not
mapped to a site and must not be created or deployed incidentally; Netlify is the
public host.

After each resource deployment, re-run the GET-only verifier, sign into the CMS,
exercise one safe read/write/revert, and inspect Function logs for new errors.

## Rollback and incident checks

- **Public route or asset failure:** confirm the Netlify published deploy, then
  restore the last known-good primary deploy in Netlify. Re-test through the
  custom domain to include Cloudflare caching and DNS.
- **`/api` failure:** call the direct Function `/api/health` endpoint, then inspect
  the Netlify proxy rule and Function logs. A healthy direct endpoint with a
  broken same-origin endpoint points to the hosting/proxy layer.
- **CMS access denied:** verify the exact Firebase Auth user and `role` claim,
  then sign out and back in. Project IAM alone does not grant FireCMS access.
- **CMS data or media failure:** inspect Firestore/Storage rules and the affected
  path. Do not loosen rules globally as an incident workaround.
- **Domain failure:** verify the Netlify custom domain first, then the Cloudflare
  `umd` record and proxy state. Escalate nameserver or renewal problems to the
  central Namecheap owner.
- **Firebase regression:** use the captured revision/release/ruleset evidence to
  restore the exact prior resource. Do not use a broad deployment as rollback.

## Provider onboarding checklist

- GitHub invitations must be accepted before invited access becomes active.
- Firebase project IAM and FireCMS authorization are separate. A new editor must
  complete the first Google sign-in, receive `role=editor`, then sign out and in.
- A Netlify team owner must grant the lowest site/developer role that permits the
  required deploys. Keep team membership and billing with a central owner.
- The Cloudflare account that contains `hack4impact.org` must grant zone-scoped
  DNS access; an unrelated account cannot delegate access to that zone.
- A central Namecheap owner must keep renewal and recovery contacts under
  organization control. Do not distribute registrar passwords.
- A central Google Cloud billing administrator must remain documented. Do not add
  billing-owner access solely for routine site maintenance.
