# H4I Website Redesign

# Overview

To further improve the Hack4Impact-UMD chapter website, we have been given the task of redesigning and improving the current website to better showcase Hack4Impacts mission while offering a professional and friendly user experience on an attractive user interface. 

Generally, we will be working on making the website more accessible, improving and adding new functionality for things like searching, improving the mobile version, and enhancing the look and feel of the website with new animations and styles.

The public website is a React and TypeScript application in `frontend/`. Its
read-only API, Firestore data, Storage media, and FireCMS editor are in
`backend-firebase/` and use the shared Firebase project `umd-website-f3e79`.
Netlify remains the public production host and proxies same-origin `/api/**`
requests to the Firebase Function. See [backend-firebase/README.md](backend-firebase/README.md)
for the backend architecture and deployment gates.

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

- React, TypeScript, Vite, Tailwind CSS, React Router
- Firebase Functions, Firestore, Storage, and FireCMS
- Vitest, Testing Library, and Playwright

# How To Run and Deploy Project

How to run the frontend:

```bash
npm --prefix frontend ci
npm --prefix frontend run dev
```

The Vite server proxies `/api` to the local Firebase Functions emulator by
default. Override `DEV_API_PROXY_URL` in an ignored local environment file when
needed; browser builds use same-origin `/api` unless `VITE_API_URL` is explicitly
set. Run the Firebase stack and its validation using the commands in
[backend-firebase/README.md](backend-firebase/README.md).

```bash
npm --prefix frontend run typecheck
npm --prefix frontend test
npm --prefix frontend run build
npm --prefix frontend run test:e2e
```

# App and content structure

- `frontend/src/pages`: route-level composition
- `frontend/src/components`: page and shared presentation components
- `frontend/src/api`: runtime-validated, read-only API client
- `frontend/src/content`: publication modes, page contracts, and safe local defaults
- `backend-firebase/functions`: public API and media proxy
- `backend-firebase/cms`: authenticated editor and content collection registry

Content documents use an atomic `mode`, `verifiedAt`, and `payload` envelope.
Only a complete, freshly verified `published` payload is displayed. Placeholder
and legacy documents use a complete local default; hidden documents render no
page content. This avoids mixing verified remote fields with local fallback
fields on the same page.
