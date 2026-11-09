import type { CSSProperties } from 'react';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_DOMAIN } from '@/lib/pageMeta';
import { ASIDE_GAP, LOGO_TILE, PADDING_X, SCREENSHOT_FRAME } from './layout';
import type { PreparedImage } from './photos';

// Brand tokens, duplicated as literals because Satori resolves neither Tailwind
// classes nor CSS custom properties. Keep in sync with tailwind.config.js.
// The card mirrors the page heroes and closing CTA: navy ground, white
// regular-weight Karla framed by the logo's corner brackets, Open Sans body.
const NAVY = '#001a33';
const BLUE = '#0069CA';
const MINT = '#80D2C8';
const WHITE = '#FFFFFF';
// CornerBrackets uses border-white/80.
const BRACKET = 'rgba(255, 255, 255, 0.8)';

// h4i_logo_white.svg is 285x38.
const BRAND_LOGO_WIDTH = 360;
const BRAND_LOGO_HEIGHT = Math.round((BRAND_LOGO_WIDTH * 38) / 285);

const BRACKET_SIZE = 52;
const BRACKET_STROKE = 3;
// The top-left bracket sits outside the text, as in the hero (`sm:-left-6`).
const BRACKET_OUTSET = 28;
// Right padding inside the bracket frame, which the bottom-right bracket uses.
const FRAME_PADDING_RIGHT = 64;

/**
 * What fills the card besides the text.
 * - photo: full bleed behind the text, as on the page heroes.
 * - screenshot: a browser-framed product screenshot on the right, as on the
 *   project page hero.
 * - logo: a partner logo on a white tile on the right.
 * - none: plain navy.
 */
export type CardVisual =
  | { kind: 'photo'; image: PreparedImage }
  | { kind: 'screenshot'; image: PreparedImage; host?: string }
  | { kind: 'logo'; image: PreparedImage }
  | { kind: 'none' };

// Satori implements `text-overflow` only partially, so long strings are cut
// here instead. The limits are tuned to the type sizes below at 1200x630.
const truncate = (value: string, limit: number) => {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= limit) return collapsed;
  const cut = collapsed.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const kept = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  // Trailing punctuation reads as a typo next to the ellipsis ("programs,…").
  return `${kept.replace(/[\s,;:.!?–—-]+$/, '')}…`;
};

interface TextScale {
  textMaxWidth: number;
  titleLimit: number;
  descriptionLimit: number;
  descriptionSize: number;
  /** Long titles step down a size or they wrap into the description. */
  titleSize: (title: string) => number;
}

// Text over a photo stays on the left, over the dense end of the navy fade.
const WIDE: TextScale = {
  textMaxWidth: 880,
  titleLimit: 70,
  descriptionLimit: 150,
  descriptionSize: 27,
  titleSize: (title) => (title.length <= 24 ? 84 : title.length <= 40 ? 66 : 54),
};

// Beside a screenshot or logo the column narrows, so type and limits shrink.
const narrow = (asideLeft: number): TextScale => ({
  textMaxWidth: asideLeft - PADDING_X - ASIDE_GAP,
  titleLimit: 60,
  descriptionLimit: 130,
  descriptionSize: 25,
  titleSize: (title) => (title.length <= 14 ? 62 : title.length <= 28 ? 52 : 44),
});

const textScaleFor = (visual: CardVisual): TextScale => {
  if (visual.kind === 'screenshot') return narrow(SCREENSHOT_FRAME.left);
  if (visual.kind === 'logo') return narrow(LOGO_TILE.left);
  return WIDE;
};

// Satori offsets absolutely positioned children by the parent's padding, so
// the root stays unpadded and every layer, text included, is placed on it.
const fill: CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
};

const root: CSSProperties = {
  position: 'relative',
  display: 'flex',
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  backgroundColor: NAVY,
  color: WHITE,
  fontFamily: 'Karla',
};

const content: CSSProperties = {
  ...fill,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: `56px ${PADDING_X}px 52px`,
};

const navy = (alpha: number) => `rgba(0, 26, 51, ${alpha})`;

// The hero overlay (`from-h4i-navy/90 from-15% via-h4i-navy/65 via-45%
// to-transparent`), held denser for longer: a card's text runs wider than the
// hero's and has to survive being shrunk to a chat thumbnail.
const photoFade = `linear-gradient(90deg, ${navy(0.94)} 0%, ${navy(0.9)} 42%, ${navy(0.74)} 70%, ${navy(0.3)} 100%)`;
// The hero's second layer (`bg-gradient-to-t from-h4i-navy/30`).
const photoFloor = `linear-gradient(0deg, ${navy(0.45)} 0%, ${navy(0)} 45%)`;
// With no photo, a faint brand-blue bloom keeps the field from reading flat.
const plainBloom = `radial-gradient(circle at 100% 100%, rgba(0, 105, 202, 0.45) 0%, rgba(0, 105, 202, 0) 60%)`;

const bracket = (corner: 'top-left' | 'bottom-right'): CSSProperties => ({
  position: 'absolute',
  width: BRACKET_SIZE,
  height: BRACKET_SIZE,
  ...(corner === 'top-left'
    ? {
        top: 0,
        left: -BRACKET_OUTSET,
        borderTop: `${BRACKET_STROKE}px solid ${BRACKET}`,
        borderLeft: `${BRACKET_STROKE}px solid ${BRACKET}`,
      }
    : {
        bottom: 0,
        right: 0,
        borderBottom: `${BRACKET_STROKE}px solid ${BRACKET}`,
        borderRight: `${BRACKET_STROKE}px solid ${BRACKET}`,
      }),
});

const PhotoBackground = ({ image }: { image: PreparedImage }) => (
  <>
    <img src={image.dataUri} width={OG_IMAGE_WIDTH} height={OG_IMAGE_HEIGHT} style={fill} alt="" />
    <div style={{ ...fill, backgroundImage: photoFade }} />
    <div style={{ ...fill, backgroundImage: photoFloor }} />
  </>
);

const TRAFFIC_LIGHTS = ['#FF5F57', '#FEBC2E', '#28C840'];

// ProjectScreenshot, squared off where it runs off the card.
const ScreenshotFrame = ({ image, host }: { image: PreparedImage; host?: string }) => (
  <div
    style={{
      position: 'absolute',
      left: SCREENSHOT_FRAME.left,
      top: SCREENSHOT_FRAME.top,
      // The 1px ring sits outside the image, so the image is never squeezed.
      width: SCREENSHOT_FRAME.width + 2,
      height: SCREENSHOT_FRAME.chromeHeight + SCREENSHOT_FRAME.imageHeight + 2,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      borderTopLeftRadius: 14,
      backgroundColor: WHITE,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 24px 60px -20px rgba(0, 0, 0, 0.55)',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: SCREENSHOT_FRAME.chromeHeight,
        padding: '0 14px',
        backgroundColor: '#F1F3F5',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      }}
    >
      {TRAFFIC_LIGHTS.map((color) => (
        <div
          key={color}
          style={{ width: 10, height: 10, marginRight: 6, borderRadius: 5, backgroundColor: color }}
        />
      ))}
      {host ? (
        <div
          style={{
            display: 'flex',
            marginLeft: 12,
            padding: '1px 12px',
            borderRadius: 4,
            backgroundColor: WHITE,
            fontFamily: 'Open Sans',
            fontSize: 13,
            color: '#4B5563',
          }}
        >
          {host}
        </div>
      ) : null}
    </div>
    <img src={image.dataUri} width={image.width} height={image.height} alt="" />
  </div>
);

// ProjectVisual: the logo contained on a white tile.
const LogoTile = ({ image }: { image: PreparedImage }) => (
  <div
    style={{
      position: 'absolute',
      left: LOGO_TILE.left,
      top: (OG_IMAGE_HEIGHT - LOGO_TILE.height) / 2,
      width: LOGO_TILE.width,
      height: LOGO_TILE.height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      backgroundColor: WHITE,
      boxShadow: '0 24px 60px -20px rgba(0, 0, 0, 0.55)',
    }}
  >
    <img src={image.dataUri} width={image.width} height={image.height} alt="" />
  </div>
);

export interface CardProps {
  title: string;
  description: string;
  logoDataUri: string;
  visual: CardVisual;
}

export const Card = ({ title, description, logoDataUri, visual }: CardProps) => {
  const scale = textScaleFor(visual);
  const heading = truncate(title, scale.titleLimit);

  return (
    <div style={root}>
      {visual.kind === 'photo' ? (
        <PhotoBackground image={visual.image} />
      ) : (
        <div style={{ ...fill, backgroundImage: plainBloom }} />
      )}
      {visual.kind === 'screenshot' ? (
        <ScreenshotFrame image={visual.image} host={visual.host} />
      ) : null}
      {visual.kind === 'logo' ? <LogoTile image={visual.image} /> : null}

      <div style={content}>
        <div style={{ display: 'flex' }}>
          <img src={logoDataUri} width={BRAND_LOGO_WIDTH} height={BRAND_LOGO_HEIGHT} alt="" />
        </div>

        {/* Bracketed like the page heroes, and sized to the text as the closing
          CTA is (`w-fit`), so a short title is not left in an empty frame. */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignSelf: 'flex-start',
            // Includes the padding, so the bottom-right bracket stays inside the
            // column instead of running into a screenshot or logo tile.
            maxWidth: scale.textMaxWidth,
            padding: `30px ${FRAME_PADDING_RIGHT}px 30px 0`,
          }}
        >
          <div style={bracket('top-left')} />
          <div style={bracket('bottom-right')} />

          <div
            style={{
              display: 'flex',
              fontSize: scale.titleSize(heading),
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
            }}
          >
            {heading}
          </div>

          <div
            style={{
              display: 'flex',
              marginTop: 24,
              fontFamily: 'Open Sans',
              fontSize: scale.descriptionSize,
              lineHeight: 1.45,
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            {truncate(description, scale.descriptionLimit)}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', fontSize: 24, fontWeight: 700 }}>
          {/* Blue-to-mint from the logo's globe, as a small signature mark. */}
          <div
            style={{
              width: 40,
              height: 4,
              marginRight: 16,
              borderRadius: 2,
              backgroundImage: `linear-gradient(90deg, ${BLUE} 0%, ${MINT} 100%)`,
            }}
          />
          <div style={{ display: 'flex', color: 'rgba(255, 255, 255, 0.85)' }}>{SITE_DOMAIN}</div>
        </div>
      </div>
    </div>
  );
};
