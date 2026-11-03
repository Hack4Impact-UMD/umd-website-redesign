import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp, { type Sharp } from 'sharp';
import { buildApiUrl } from '@/api/http';
import { resolveMediaUrl } from '@/lib/media';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, type StaticPagePath } from '@/lib/pageMeta';
import { LOGO_TILE, SCREENSHOT_FRAME } from './layout';

const assetPath = (...segments: string[]) =>
  path.join(process.cwd(), 'src', 'components', 'assets', ...segments);

/**
 * The photo behind each static page's card: the hero photo that page ships
 * with in its content defaults. These are read from disk rather than from the
 * CMS so a card never depends on a media fetch; if an editor swaps a hero in
 * the CMS, the card keeps the default until this map is updated.
 */
export const STATIC_PAGE_PHOTOS: Record<StaticPagePath, string> = {
  '/': assetPath('apply', 'apply-classroom.webp'),
  '/aboutus': assetPath('home', 'testimonials.webp'),
  '/contactus': assetPath('h4igroup_photo.webp'),
  '/ourwork': assetPath('project-library-hero.webp'),
  '/apply/student': assetPath('apply', 'apply-team.webp'),
  '/apply/nonprofit': assetPath('apply', 'apply-team.webp'),
};

/** The home page's photo doubles as the fallback card's. */
export const DEFAULT_PHOTO = STATIC_PAGE_PHOTOS['/'];

/** A committed file, or a CMS media reference as stored on the document. */
export type ImageSource = { file: string } | { media: string };

/**
 * How an image is prepared for its slot on the card. Satori decodes only PNG,
 * JPEG and GIF, and the site's images are mostly WebP, so everything is
 * re-encoded, already sized to its slot so Satori and resvg are not handed
 * full-resolution originals.
 */
export type ImagePreset = 'photo' | 'screenshot' | 'logo';

const PRESETS: Record<ImagePreset, (image: Sharp) => Sharp> = {
  // Full bleed behind the text.
  photo: (image) =>
    image
      .resize(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 82, mozjpeg: true }),
  // Fills the browser frame, pinned to the screenshot's top-left corner: the
  // header and navigation stay in view, and anything that does not fit is
  // lost off the right and bottom, the way a browser window cuts off a page.
  screenshot: (image) =>
    image
      .resize(SCREENSHOT_FRAME.width, SCREENSHOT_FRAME.imageHeight, {
        fit: 'cover',
        position: 'left top',
      })
      .jpeg({ quality: 85, mozjpeg: true }),
  // Contained, never cropped, and PNG so a transparent logo stays transparent
  // on its white tile.
  logo: (image) =>
    image
      .resize(LOGO_TILE.logoMaxWidth, LOGO_TILE.logoMaxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png(),
};

const toDataUri = async (input: Buffer, preset: ImagePreset) => {
  // Rotated per EXIF first, so phone photos are not drawn sideways.
  const image = sharp(input).autoOrient();
  const { data, info } = await PRESETS[preset](image).toBuffer({
    resolveWithObject: true,
  });
  return {
    dataUri: `data:image/${info.format};base64,${data.toString('base64')}`,
    width: info.width,
    height: info.height,
  };
};

export type PreparedImage = Awaited<ReturnType<typeof toDataUri>>;

const PHOTO_FETCH_TIMEOUT_MS = 20_000;

/**
 * A CMS media reference as this process can fetch it. resolveMediaUrl gives
 * the public, same-origin `/api/...` form used in HTML, which has no origin to
 * resolve against at build time, so that is rewritten onto API_BASE_URL.
 */
const fetchableMediaUrl = (source: string) => {
  const resolved = resolveMediaUrl(source);
  if (resolved.startsWith('/api/')) return buildApiUrl(resolved.slice('/api/'.length));
  if (resolved.startsWith('https://') || resolved.startsWith('http://')) return resolved;
  return null;
};

const fetchImage = async (url: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(PHOTO_FETCH_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
};

// Several cards share an image (both apply pages, home and the fallback).
const cache = new Map<string, Promise<PreparedImage | undefined>>();

/**
 * Committed files are trusted: a missing one is a code error and fails the
 * build. A missing or broken CMS image only costs the card its visual, so it
 * resolves to undefined with a warning rather than failing the deploy.
 */
export const loadImage = (
  source: ImageSource,
  preset: ImagePreset,
): Promise<PreparedImage | undefined> => {
  const key = `${preset}:${'file' in source ? `file:${source.file}` : `media:${source.media}`}`;
  const existing = cache.get(key);
  if (existing) return existing;

  let pending: Promise<PreparedImage | undefined>;
  if ('file' in source) {
    pending = readFile(source.file).then((bytes) => toDataUri(bytes, preset));
  } else {
    const url = fetchableMediaUrl(source.media);
    pending = !url
      ? Promise.resolve(undefined)
      : fetchImage(url)
          .then((bytes) => toDataUri(bytes, preset))
          .catch((error: unknown) => {
            console.warn(`[og] Could not load card image ${url}; rendering without it.`, error);
            return undefined;
          });
  }

  cache.set(key, pending);
  return pending;
};
