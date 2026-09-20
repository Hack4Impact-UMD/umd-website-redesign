# Changelog

### v3: Astro prerendering

- Replaced the Vite single-page application with Astro. Astro builds every page to HTML before deployment.
- Removed React Router. Each route is now a separate HTML file.
- Reduced the JavaScript on most pages from 118 KB to under 1 KB. Only the home page and the Our Work page send React.
- Moved all content reads to the build. The browser makes no API request for content.
- Added a `<title>`, a description, Open Graph tags, and a canonical address to each page. Added a sitemap.
- Rewrote the navigation menu and the scroll-to-top button without React.
- Replaced the FAQ accordion with a native `<details>` element.
- Added a Firestore trigger that starts a Netlify build after a content edit.
- Deleted 114 unused image files and re-encoded the four largest photos to WebP.
- Raised the Node version to 22. Astro 7 needs this version.

### v2: Fall 2022 Sparkle Squad

- Fixed css on Project Pages

### v.1: Summer 2022 

- Routing Added
- Strapi CMS Implemented, Content structure created

### v.0: Spring 2022 

- Components created
