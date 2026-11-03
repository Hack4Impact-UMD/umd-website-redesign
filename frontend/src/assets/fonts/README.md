# OG image fonts

Static TrueType instances of [Karla](https://fonts.google.com/specimen/Karla)
(v33) and [Open Sans](https://fonts.google.com/specimen/Open+Sans) (v44), used
only by the build-time OG image renderer in `src/og/`. They match the site's
heading and body faces.

They are committed because Satori needs the font bytes in-process and cannot
use the Google Fonts stylesheet that `src/layouts/Head.astro` loads for the
site itself. Nothing here is served to browsers.

`google/fonts` ships both families only as variable fonts, which Satori renders
at a single weight, so these were pulled as static instances from the Google
Fonts CSS API:

    curl -A "Mozilla/5.0 (Linux; U; Android 2.2; en-us; Nexus One Build/FRF91) \
      AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1" \
      "https://fonts.googleapis.com/css2?family=Karla:wght@400"

and downloading the `.ttf` the stylesheet points at (`Karla:wght@700` for the
bold, `Open+Sans:wght@400` for Open Sans).

Both are licensed under the SIL Open Font License 1.1 — see `OFL-Karla.txt`
and `OFL-OpenSans.txt`.
