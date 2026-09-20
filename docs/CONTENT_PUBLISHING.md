# Content publishing

This page is for the editors who use FireCMS.

## What changed

The website is now prerendered. Netlify builds every page to HTML before a
visitor opens it. The visitor gets that HTML directly.

Before, the browser read your edit from the database on each visit. Your edit
appeared immediately.

Now, your edit appears only after Netlify builds the site again.

## How long an edit takes

Your edit appears in 2 to 7 minutes.

| Step | Time |
| --- | --- |
| A trigger receives your save | Immediate |
| The trigger waits for more saves | 0 to 5 minutes |
| Netlify builds the site | 1 to 2 minutes |

The wait exists to save build minutes. If you edit eight fields, the site does
not build eight times. It builds one time, and then one more time after your
last save.

## What to expect

- Save your work as usual. Do not save a field twice to make the site build.
- Wait 7 minutes before you report a problem.
- Refresh the page with `Ctrl+Shift+R`, or `Cmd+Shift+R` on a Mac.

## If your edit does not appear

1. Open the Netlify dashboard for the `umd-h4i` project.
2. Look at the most recent deploy.
3. Read the steps below for the state you see.

**The deploy is green, but your edit is absent.**
Your edit is probably not published. Open the document in FireCMS. Set `mode`
to `published`. Set `verifiedAt` to the current date. The site shows the local
default content for a `placeholder` document.

**The deploy failed.**
The build reads content from the API. The build stops if the API is
unavailable. Netlify keeps the previous version of the site online, so
visitors see no error. Tell a developer.

**There is no new deploy.**
The rebuild trigger did not run. Tell a developer.

## Emergency publishing

Use the Netlify dashboard to build the site immediately:

1. Open the `umd-h4i` project.
2. Select **Deploys**.
3. Select **Trigger deploy**.
4. Select **Deploy site**.

## For developers

The rebuild trigger is in `backend-firebase/functions/src/triggers/`. It
watches the six `content_*` collections, the `projects` collection, and the
`members` collection.

The trigger writes to `system_build/netlify`. This document holds the cooldown
state. Clients cannot read or write it.

A scheduled function runs every 5 minutes. It starts a build if an edit is
waiting. It also starts a build if the last build is more than 24 hours old.
The 24 hour limit exists because the build evaluates the student application
deadline. Without the limit, a closed application could stay open on the site.
