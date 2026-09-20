import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { DEFAULT_DESCRIPTION, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/pageMeta';
import { Card } from './Card';

// Satori needs the font bytes; the site itself loads Karla from the Google
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
} as const;

const WORDMARK_FILE = buildAssetPath('src', 'components', 'assets', 'h4iumd_wordmark_blue.png');

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
  wordmarkDataUri: string;
}

const loadAssets = async (): Promise<OgAssets> => {
  const [regular, bold, wordmark] = await Promise.all([
    readBuildAsset(FONT_FILES.regular),
    readBuildAsset(FONT_FILES.bold),
    readBuildAsset(WORDMARK_FILE),
  ]);

  return {
    fonts: [
      { name: 'Karla', data: regular, weight: 400 as const, style: 'normal' as const },
      { name: 'Karla', data: bold, weight: 700 as const, style: 'normal' as const },
    ],
    wordmarkDataUri: `data:image/png;base64,${wordmark.toString('base64')}`,
  };
};

// ~40 cards per build, so load the shared inputs once.
let assetsPromise: Promise<OgAssets> | null = null;

const getAssets = () => (assetsPromise ??= loadAssets());

export interface OgImageInput {
  title: string;
  description?: string;
}

/** Renders one 1200x630 PNG card. Used by the prerendered /og/*.png routes. */
export const renderOgImage = async ({ title, description }: OgImageInput): Promise<Buffer> => {
  const { fonts, wordmarkDataUri } = await getAssets();

  const svg = await satori(
    Card({ title, description: description ?? DEFAULT_DESCRIPTION, wordmarkDataUri }),
    { width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, fonts },
  );

  return Buffer.from(
    new Resvg(svg, { fitTo: { mode: 'width', value: OG_IMAGE_WIDTH } }).render().asPng(),
  );
};
