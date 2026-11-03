import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { DEFAULT_DESCRIPTION, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/pageMeta';
import { Card, type CardVisual } from './Card';
import { loadImage, type ImageSource } from './photos';

// Satori needs the font bytes; the site itself loads Karla and Open Sans from the Google
// Fonts CDN, which is unreachable from a render call. These are read from disk
// rather than imported so Vite does not emit them into `dist/` — they are a
// build-time input, not a served asset.
//
// Paths resolve against the Astro project root: `astro build` runs with the
// working directory set to it, both locally and on Netlify (`base = "frontend"`).
const buildAssetPath = (...segments: string[]) => path.join(process.cwd(), ...segments);

const FONT_FILES = {
  regular: buildAssetPath('src', 'assets', 'fonts', 'Karla-Regular.ttf'),
  bold: buildAssetPath('src', 'assets', 'fonts', 'Karla-Bold.ttf'),
  body: buildAssetPath('src', 'assets', 'fonts', 'OpenSans-Regular.ttf'),
} as const;

// The white variant the navbar shows over the navy heroes.
const LOGO_FILE = buildAssetPath('src', 'components', 'assets', 'h4i_files', 'h4i_logo_white.svg');

const readBuildAsset = async (file: string) => {
  try {
    return await readFile(file);
  } catch (cause) {
    throw new Error(
      `Could not read the OG image asset at ${file}. ` +
        'It is resolved against the working directory, which must be the frontend/ project root.',
      { cause },
    );
  }
};

type SatoriFont = NonNullable<Parameters<typeof satori>[1]['fonts']>[number];

interface OgAssets {
  fonts: SatoriFont[];
  logoDataUri: string;
}

const loadAssets = async (): Promise<OgAssets> => {
  const [regular, bold, body, logo] = await Promise.all([
    readBuildAsset(FONT_FILES.regular),
    readBuildAsset(FONT_FILES.bold),
    readBuildAsset(FONT_FILES.body),
    readBuildAsset(LOGO_FILE),
  ]);

  return {
    fonts: [
      { name: 'Karla', data: regular, weight: 400 as const, style: 'normal' as const },
      { name: 'Karla', data: bold, weight: 700 as const, style: 'normal' as const },
      { name: 'Open Sans', data: body, weight: 400 as const, style: 'normal' as const },
    ],
    logoDataUri: `data:image/svg+xml;base64,${logo.toString('base64')}`,
  };
};

// ~40 cards per build, so load the shared inputs once.
let assetsPromise: Promise<OgAssets> | null = null;

const getAssets = () => (assetsPromise ??= loadAssets());

/**
 * Where a card's visual comes from. Kept as references rather than bytes so
 * getStaticPaths props stay small and each image is decoded only when its
 * card renders.
 * - photo: a page hero photo, drawn full bleed.
 * - project: the product screenshot when there is one, else the partner logo.
 */
export type OgVisualSource =
  | { kind: 'photo'; source: ImageSource }
  | { kind: 'project'; screenshot?: ImageSource; logo?: ImageSource; host?: string };

export interface OgImageInput {
  title: string;
  description?: string;
  visual?: OgVisualSource;
}

const resolveVisual = async (visual: OgVisualSource | undefined): Promise<CardVisual> => {
  if (!visual) return { kind: 'none' };

  if (visual.kind === 'photo') {
    const image = await loadImage(visual.source, 'photo');
    return image ? { kind: 'photo', image } : { kind: 'none' };
  }

  // A screenshot that fails to load falls back to the logo, not to nothing.
  const screenshot = visual.screenshot && (await loadImage(visual.screenshot, 'screenshot'));
  if (screenshot) return { kind: 'screenshot', image: screenshot, host: visual.host };
  const logo = visual.logo && (await loadImage(visual.logo, 'logo'));
  if (logo) return { kind: 'logo', image: logo };
  return { kind: 'none' };
};

/** Renders one 1200x630 PNG card. Used by the prerendered /og/*.png routes. */
export const renderOgImage = async ({
  title,
  description,
  visual,
}: OgImageInput): Promise<Buffer> => {
  const [{ fonts, logoDataUri }, cardVisual] = await Promise.all([
    getAssets(),
    resolveVisual(visual),
  ]);

  const svg = await satori(
    Card({
      title,
      description: description ?? DEFAULT_DESCRIPTION,
      logoDataUri,
      visual: cardVisual,
    }),
    { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, fonts },
  );

  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: 'width', value: OG_IMAGE_WIDTH } }).render().asPng(),
  );
};
