# H4I Website Redesign

# Overview

The Hack4Impact-UMD chapter website shows the work of the chapter. It shows the
projects, the members, and the ways to apply.

The public site is an Astro application in `frontend/`. Astro builds every page
to HTML before deployment. Most pages send no JavaScript to the browser.

The read-only API, the Firestore data, the Storage media, and the FireCMS
editor are in `backend-firebase/`. They use the Firebase project
`umd-website-f3e79`.

Netlify hosts the public site. Netlify sends `/api/**` requests to the Firebase
Function. The build reads content from the same Function.

An edit in FireCMS appears on the site after Netlify builds the site again.
This takes 2 to 7 minutes. Read
[docs/CONTENT_PUBLISHING.md](docs/CONTENT_PUBLISHING.md).

For the backend architecture and the deployment gates, read
[backend-firebase/README.md](backend-firebase/README.md).

## Production services map

| Service | Production location | Source and configuration |
| --- | --- | --- |
| Public frontend | Netlify project `umd-h4i` at [umd.hack4impact.org](https://umd.hack4impact.org/) | App: `frontend/`; build and API proxy: `netlify.toml` |
| FireCMS editor | Firebase Hosting at [umd-website-f3e79.web.app](https://umd-website-f3e79.web.app/) | App: `backend-firebase/cms/`; Hosting targets: `backend-firebase/.firebaserc` and `backend-firebase/firebase.json` |
| Public API | Firebase Gen 2 Function `api` in `us-central1` at `https://us-central1-umd-website-f3e79.cloudfunctions.net/api` | Code: `backend-firebase/functions/`; deployment config: `backend-firebase/firebase.json`; Netlify proxy: `netlify.toml` |
| Content database | Default Firestore database in Firebase project `umd-website-f3e79` | Rules: `backend-firebase/firestore.rules`; API and CMS data access: `backend-firebase/functions/` and `backend-firebase/cms/` |
| Media storage | Firebase Storage bucket `umd-website-f3e79.firebasestorage.app` | Rules: `backend-firebase/storage.rules`; media API: `backend-firebase/functions/src/routes/media.ts` |
| CMS sign-in | Firebase Authentication in project `umd-website-f3e79` | Client setup and authorization: `backend-firebase/cms/src/firebaseConfig.ts` and `backend-firebase/cms/src/App.tsx` |
| Domain and DNS | Domain registered with Namecheap; DNS hosted in Cloudflare | Managed in the provider consoles; the repository does not contain registrar or DNS credentials |

The redesign does not currently use a separate analytics platform, form
processor, or application email-delivery service. Application and newsletter
destinations are content-managed links, while contact links use `mailto:`.
For Firebase deployment commands and safety gates, see
[backend-firebase/README.md](backend-firebase/README.md). For the recorded live
resource inventory and parity checks, see
[backend-firebase/SOURCE_PARITY.md](backend-firebase/SOURCE_PARITY.md).

The older Strapi application remains in `backend/` only as a migration and
historical reference. It is not the active backend and should not be started or
deployed as part of the redesign; its former Heroku and Cloudinary integrations
are not production dependencies for the redesign.


### Links

- 👾 [Live Deploy](https://umd.hack4impact.org/)
- [Technical Design Doc](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Technical%20Design%20Doc%20f8b67954916f49bc9feb8a8f89430715.md):  includes some architecture of site, initial design proposal
- [User Guide/Feature List](https://www.notion.so/User-Guide-Feature-List-bd562efc39b2404fabb7cdcb9325b2cf): request access! 
    - How to add new content to the website 
    - How to use the CMS backend
- Technical Pages/Dev Guides
    * [Component Structure + Project Cards, Value Cards, Search, Pages](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/docs/Component%20Structure%20%2B%20Project%20Cards%2C%20Value%20Cards.md)
    * [Deployment (detail)](https://www.notion.so/Deployment-detail-57ac1f04d4cf4cbc8ab339c9634081b1d): request access! 
    * [Manual Testing](H4I%20Website%20Redesign%20Technical%20Documentation%20READM%20d98c2749b37d4928ab9dce70bdd79efe/Manual%20Testing%2092d90d0dc8db42d5b5d351d09333b3b5.md) 
    * [Helpful Commands & Misc Important Notes Dump](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/docs/Helpful%20Commands%20%26%20Misc%20Important%20Notes%20Dump.md) 
    * [Known Bugs](https://www.notion.so/h4i/Known-Bugs-7f2921a97f8c412dad57264ad2d2f6c3)
- [CHANGELOG.md](https://github.com/Hack4Impact-UMD/umd-website-redesign/blob/main/CHANGELOG.md): request access! 

# Dependencies, Libraries, Frameworks

- Astro, React, TypeScript, and Tailwind CSS
- Firebase Functions, Firestore, Storage, and FireCMS
- Vitest, Testing Library, and Playwright

Astro renders the React components to HTML during the build. Four components
stay interactive in the browser. The site does not use a client-side router.

# How To Run and Deploy Project

Node.js 22.12 or later is necessary. Astro 7 needs this version.

Start the Firebase emulator:

```bash
cd backend-firebase
npx firebase-tools@14.1.0 emulators:start --project demo-umd-website
```

Start the frontend in a second terminal:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

The build reads content from the API on the server. Set `API_BASE_URL` to an
absolute address. `frontend/.env.example` gives the emulator address. A
relative `/api` address has no meaning on a server.

Run the full validation:

```bash
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run test:e2e
```

Netlify builds and hosts the public site. `netlify.toml` holds the build
command, the Node version, and `API_BASE_URL`. For the Firebase deployment
steps, read [backend-firebase/README.md](backend-firebase/README.md).

# App and content structure

- `frontend/src/pages`: the Astro pages. Each page reads its content, then gives that content to React components.
- `frontend/src/layouts`: the page shell, the `<head>` tags, and the site chrome
- `frontend/src/components`: the React components. Astro renders them to HTML.
- `frontend/src/api`: the read-only API client. It checks every response against a schema.
- `frontend/src/api/buildData.ts`: the build-time loaders. They cache each request, so one build makes about eight requests.
- `frontend/src/content-schema`: the publication modes, the page contracts, and the local default content
- `backend-firebase/functions`: the public API, the media proxy, and the rebuild triggers
- `backend-firebase/cms`: authenticated editor and content collection registry

Content documents use an atomic `mode`, `verifiedAt`, and `payload` envelope.
Only a complete, freshly verified `published` payload is displayed. Placeholder
and legacy documents use a complete local default; hidden documents render no
page content. This avoids mixing verified remote fields with local fallback
fields on the same page.
