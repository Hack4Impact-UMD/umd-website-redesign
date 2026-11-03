import type { APIRoute, GetStaticPaths } from 'astro';
import { loadAllProjects } from '@/api/buildData';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  SITE_TAGLINE,
  STATIC_PAGE_META,
  projectOgImagePath,
  staticPageOgImagePath,
  type StaticPagePath,
} from '@/lib/pageMeta';
import { DEFAULT_PHOTO, STATIC_PAGE_PHOTOS } from '@/og/photos';
import { renderOgImage, type OgVisualSource } from '@/og/render';

interface OgRouteProps {
  title: string;
  description: string;
  visual?: OgVisualSource;
}

// '/og/aboutus.png' -> 'aboutus'. The helpers own the naming so the meta tag
// Head.astro emits and the file generated here cannot drift apart.
// Shown in the screenshot frame's address bar, as on the project page.
const hostOf = (url?: string) => {
  if (!url) return undefined;
  try {
    return new URL(url).host;
  } catch {
    return undefined;
  }
};

const slugFromImagePath = (imagePath: string) => imagePath.slice('/og/'.length, -'.png'.length);

export const getStaticPaths = (async () => {
  const projects = await loadAllProjects();

  const projectEntries = projects.map((project) => {
    const { title, summary, path, image, screenshot, hostedProjectURL } = project.attributes;
    const screenshotSource = screenshot?.data?.attributes.url;
    const logoSource = image.data[0]?.attributes.url;
    return {
      imagePath: projectOgImagePath(path),
      sourcePath: path,
      title,
      description: summary,
      // What the project's own page shows: its screenshot in the hero, or
      // failing that the partner logo.
      visual: {
        kind: 'project',
        screenshot: screenshotSource ? { media: screenshotSource } : undefined,
        logo: logoSource ? { media: logoSource } : undefined,
        host: hostOf(hostedProjectURL),
      } satisfies OgVisualSource,
    };
  });

  // Two CMS slugs can differ only in punctuation or case and collapse onto one
  // file name, which would silently give both projects the same card. Fail the
  // build instead, mirroring the nested-path guard in ourwork/[projectpath].
  const byImagePath = new Map<string, string[]>();
  for (const entry of projectEntries) {
    byImagePath.set(entry.imagePath, [
      ...(byImagePath.get(entry.imagePath) ?? []),
      entry.sourcePath,
    ]);
  }
  const collisions = [...byImagePath].filter(([, sources]) => sources.length > 1);
  if (collisions.length > 0) {
    throw new Error(
      `Project paths collapse to the same OG image file: ${collisions
        .map(([imagePath, sources]) => `${imagePath} <- ${sources.join(', ')}`)
        .join('; ')}`,
    );
  }

  const staticEntries = (Object.keys(STATIC_PAGE_META) as StaticPagePath[]).map((pathname) => {
    const meta = STATIC_PAGE_META[pathname];
    return {
      imagePath: staticPageOgImagePath(pathname),
      title: 'cardTitle' in meta ? meta.cardTitle : meta.title,
      description: 'description' in meta ? meta.description : DEFAULT_DESCRIPTION,
      visual: {
        kind: 'photo',
        source: { file: STATIC_PAGE_PHOTOS[pathname] },
      } satisfies OgVisualSource,
    };
  });

  return [
    // The fallback card, for /404 and any route with no card of its own.
    {
      imagePath: DEFAULT_OG_IMAGE_PATH,
      title: SITE_TAGLINE,
      description: DEFAULT_DESCRIPTION,
      visual: { kind: 'photo', source: { file: DEFAULT_PHOTO } } satisfies OgVisualSource,
    },
    ...staticEntries,
    ...projectEntries,
  ].map(({ imagePath, title, description, visual }) => ({
    params: { slug: slugFromImagePath(imagePath) },
    props: { title, description, visual } satisfies OgRouteProps,
  }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<OgRouteProps> = async ({ props }) => {
  const png = await renderOgImage(props);

  // Static output: this becomes a file in dist/og/, and Netlify owns the
  // caching headers it is served with.
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
