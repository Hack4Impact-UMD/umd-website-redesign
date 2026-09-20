# Hack4Impact UMD frontend

The public site is an Astro application. Astro builds every page to HTML before
deployment. The browser gets HTML and almost no JavaScript.

The build reads the page content, the projects, the members, and the site
settings from the Firebase Function API. The build does this on the server. The
browser makes no API request for content.

Four components stay interactive in the browser:

| Component | Page |
| --- | --- |
| Hero carousel | Home |
| Project search | Our Work |
| Navigation menu | Every page |
| Scroll-to-top button | Every page |

The navigation menu and the scroll-to-top button use small scripts. They do not
use React. Pages without a React component send 0 KB of JavaScript.

`src/content-schema/` holds the local default content. The site shows this
default content when a Firebase document is hidden, legacy, or invalid.

## Requirements

- Node.js 22.12 or later. Astro 7 needs this version.
- npm
- The Firebase CLI, but only for the emulator or for an approved deployment

Install the workspaces from the repository root:

```bash
npm --prefix frontend ci
npm --prefix backend-firebase/functions ci
npm --prefix backend-firebase/cms ci
```

## Local development

Start the Firebase emulator first. The `demo-` project cannot write to the live
project.

```bash
cd backend-firebase
npx firebase-tools@14.1.0 emulators:start --project demo-umd-website
```

Start the Astro server in a second terminal:

```bash
npm --prefix frontend run dev
```

Astro runs at <http://localhost:3000>.

### Environment variables

`frontend/.env.example` lists three variables.

| Variable | Function |
| --- | --- |
| `API_BASE_URL` | The API address for the build. The build needs an absolute address. |
| `DEV_API_PROXY_URL` | The proxy target for browser image requests in development. |
| `PUBLIC_API_URL` | The API address for the browser. Keep it empty for same-origin `/api`. |

`API_BASE_URL` is necessary. A relative `/api` address has no meaning on a
server. The build stops with an error if this variable is empty.

`PUBLIC_API_URL` must stay empty in production. The browser then requests
images through the Netlify proxy. If you set an absolute address, Astro writes
that address into every image tag in the HTML. Those addresses do not use the
Netlify cache.

Do not put Firebase Admin credentials in the frontend.

## Validation

Run these four commands from the repository root:

```bash
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run test:e2e
```

`npm run build` needs `API_BASE_URL`. Netlify supplies the production value
from `netlify.toml`.

The Playwright tests do three steps. First, they start a fixture API server on
port 4319. Second, they build the site against that server. Third, they start a
preview server on port 4173. The tests do not need live Firebase data.

Check the live API contract separately:

```bash
node backend-firebase/scripts/verify-live-contract.mjs
```

## Deployment

Netlify builds and hosts the public site. `netlify.toml` holds the build
command, the Node version, and `API_BASE_URL`.

Netlify keeps one redirect. It sends `/api/*` to the Firebase Function. The
browser still needs this redirect for images, because the Storage rules refuse
public reads.

There is no SPA fallback redirect. Each route has its own HTML file. Netlify
sends `dist/404.html` with a 404 status for an unknown address.

`API_BASE_URL` and the redirect must point to the same Function.
`src/test/deployment-config.test.ts` tests this.

For the Firebase deployment steps and the approval gates, read
[`backend-firebase/README.md`](../backend-firebase/README.md).
