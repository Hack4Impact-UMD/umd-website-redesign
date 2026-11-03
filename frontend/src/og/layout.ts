import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from '@/lib/pageMeta';

/**
 * Card geometry shared by the layout (Card.tsx) and the image preparation
 * (photos.ts), so images are encoded at exactly the size they are drawn.
 */

export const PADDING_X = 96;
/** Space between the text column and a visual on the right. */
export const ASIDE_GAP = 56;

const SCREENSHOT_TOP = 150;
const SCREENSHOT_LEFT = 700;
/** How far the frame runs past the card's right edge. */
const SCREENSHOT_BLEED = 60;
const SCREENSHOT_CHROME_HEIGHT = 40;

/**
 * A browser-framed screenshot, as on the project page hero: it bleeds off the
 * card's right and bottom edges the way the hero crops it at `xl`. The image
 * is sized to the whole frame, including the part off the card, so the visible
 * window is exactly what would show if the card were larger.
 */
export const SCREENSHOT_FRAME = {
  top: SCREENSHOT_TOP,
  left: SCREENSHOT_LEFT,
  width: OG_IMAGE_WIDTH - SCREENSHOT_LEFT + SCREENSHOT_BLEED,
  chromeHeight: SCREENSHOT_CHROME_HEIGHT,
  imageHeight: OG_IMAGE_HEIGHT - SCREENSHOT_TOP - SCREENSHOT_CHROME_HEIGHT,
} as const;

const LOGO_TILE_WIDTH = 360;
const LOGO_TILE_HEIGHT = 270;

/** A partner logo on a white tile, as ProjectVisual shows it (`max-w-[70%]`). */
export const LOGO_TILE = {
  width: LOGO_TILE_WIDTH,
  height: LOGO_TILE_HEIGHT,
  left: OG_IMAGE_WIDTH - PADDING_X - LOGO_TILE_WIDTH,
  logoMaxWidth: Math.round(LOGO_TILE_WIDTH * 0.7),
  logoMaxHeight: Math.round(LOGO_TILE_HEIGHT * 0.6),
} as const;
