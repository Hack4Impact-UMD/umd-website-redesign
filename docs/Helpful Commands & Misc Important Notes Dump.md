# Helpful Commands & Misc Important Notes Dump

## Frontend commands

Node.js 22.12 or later is necessary.

| Command | Function |
| --- | --- |
| `npm --prefix frontend run dev` | Start the Astro development server on port 3000 |
| `npm --prefix frontend run build` | Build every page to HTML. Needs `API_BASE_URL`. |
| `npm --prefix frontend run preview` | Serve the built site on port 4173 |
| `npm --prefix frontend run typecheck` | Run `astro check` |
| `npm --prefix frontend test` | Run the Vitest unit tests |
| `npm --prefix frontend run test:e2e` | Build the site against fixed test data, then run Playwright |

## Notes after the Astro migration

Set `API_BASE_URL` to an absolute address before you build. A relative `/api`
address has no meaning on a server. The build stops with an error if the
variable is empty.

Keep `PUBLIC_API_URL` empty. The browser then requests images through the
Netlify proxy. An absolute address goes into every image tag in the HTML, and
those addresses do not use the Netlify cache.

Import an image with the `?url` suffix. Astro returns an object for a plain
`.png` import and a component for a plain `.svg` import. The suffix returns the
address as text.

Give a `client:` directive only to a component that is a direct child of an
`.astro` file. A directive inside a React component has no effect.

A component in the shared layout sends its JavaScript to every page. Measure
the JavaScript on a page before you make a layout component interactive.

The build fails if the API is unavailable. Netlify keeps the previous version
of the site online, so visitors see no error.

## Historical notes

The notes below are from earlier versions of the site. Some are no longer
correct. `App.tsx` no longer exists, because Astro does the routing. Strapi is
no longer the backend. Most components use Tailwind, not CSS modules.

- z indexes: originally were all over the place
- nav and footer are global components
- routing done in App.tsx, not in index.tsx (link to commit here: )
- using css modules
- strapi cms:
    - we used default setup: there was no super custom thing