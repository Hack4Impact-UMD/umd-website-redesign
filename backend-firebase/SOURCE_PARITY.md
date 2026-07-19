# Firebase source parity record

This directory was selectively recovered from `backend-migration` commit
`a85917c8f123b0728fd5b58b712e0d6664d8571f`. That commit is a candidate source
snapshot; it is not assumed to be byte-for-byte identical to the currently
deployed Firebase release.

## Read-only live baseline

- API: `https://us-central1-umd-website-f3e79.cloudfunctions.net/api`
- Health: `ok`
- Projects: 32
- Project ID/path SHA-256: `99471f139b776d82a10d30cb8d9956a45c325cae81c597e77b595ce479e5f8d6`
- Members: 212
- Member ID SHA-256: `eb21bfba1cf37b9d88c54ee5be17a57872e480f8aff9d1766bfa775a2f6f72e8`
- Content documents: `home`, `about`, `our-work`, `apply/student`,
  `apply/nonprofit`, and `site-settings`
- CMS Hosting site: `umd-website-f3e79`
- Function: `api`, region `us-central1`

## Read-only deployed revision metadata

Captured with the authenticated Firebase CLI on 2026-07-19:

- Function `api`: generation 2, state `ACTIVE`, runtime `nodejs20`, region
  `us-central1`, entry point `api`
- Function resources: 512 MB memory, 60 second timeout, 1 CPU, concurrency 80,
  and maximum 3 instances
- Function source: `gcf-v2-sources-325688622176-us-central1` /
  `api/function-source.zip`, generation `1771801929092652`
- Firebase Function source hash:
  `940897978b8a7a6ca12a4599d57ef73df3b8b8fe`
- Function update timestamp: not exposed by `firebase functions:list`
- Current Function environment: no `ALLOWED_ORIGINS` value is deployed. A future
  Function deployment must set the intended exact browser origins first because
  this source intentionally fails closed for browser CORS.
- Hosting site: `projects/umd-website-f3e79/sites/umd-website-f3e79`, type
  `DEFAULT_SITE`, live URL `https://umd-website-f3e79.web.app`
- Live Hosting release: `1771801996104000`, release time
  `2026-02-22T23:13:16.104Z`
- Live Hosting version: `1edae28063b83490`, status `FINALIZED`, finalized at
  `2026-02-22T23:13:16.058656Z`, 6 files / 1,183,477 bytes
- Active Firestore and Storage ruleset IDs: not exposed by a read-only Firebase
  CLI command in this environment. The direct Rules API could not reuse the
  non-interactive CLI credential, so these identifiers remain to be captured
  immediately before any separately approved rules deployment.

The verifier fetches every collection page, sorts IDs numerically, and hashes
newline-terminated records. It never authenticates to Firestore or writes data.

```bash
node backend-firebase/scripts/verify-live-contract.mjs
```

## Intentional source changes before any deployment

- Browser CORS changes from implicit allow-all to an explicit exact-origin list.
- Pagination preserves page sizes through 200 and clamps larger values to 250.
- Invalid query values return a non-cacheable 400 instead of silently widening a query.
- Combined project filters are rejected because no composite indexes are declared.
- Public media paths are decoded once, restricted to supported roots, and served only as images.
- Project/member deletes are disabled until reverse-relation deletion cleanup exists.
- Reverse relation updates use atomic array transforms so unrelated CMS edits are not overwritten.
- CMS Hosting is addressable only through the named `cms` target.

FireCMS saves the primary entity before its post-save reverse-relation batch;
those two operations are not one Firestore transaction. Target pre-validation,
disabled project/member deletion, atomic array transforms, and surfaced
post-save failures reduce that residual inconsistency risk without silently
overwriting unrelated edits.

## Remaining parity uncertainty

Firebase does not expose a repository commit for the current Function or CMS
release. Behavioral parity is therefore established through the live verifier,
emulator contract tests, and read-only deployment metadata—not by claiming an
unavailable source digest. This PR performs no deployment. Merge approval does
not authorize a live deployment.
