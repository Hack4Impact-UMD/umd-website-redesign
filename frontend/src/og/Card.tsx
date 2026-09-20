import type { CSSProperties } from 'react';
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_DOMAIN } from '@/lib/pageMeta';

// Brand tokens, duplicated as literals because Satori resolves neither Tailwind
// classes nor CSS custom properties. Keep in sync with tailwind.config.js.
const BLUE = '#0069CA';
const MINT = '#80D2C8';
const INK = '#333333';
const GRAY = '#657788';
const BACKGROUND = '#F9FAFB';

const WORDMARK_WIDTH = 300;
const WORDMARK_HEIGHT = Math.round((WORDMARK_WIDTH * 300) / 2248);

// Satori implements `text-overflow` only partially, so long strings are cut
// here instead. The limits are tuned to the type sizes below at 1200x630.
const TITLE_LIMIT = 70;
const DESCRIPTION_LIMIT = 150;

const truncate = (value: string, limit: number) => {
  const collapsed = value.replace(/\s+/g, ' ').trim();
  if (collapsed.length <= limit) return collapsed;
  const cut = collapsed.slice(0, limit - 1);
  const lastSpace = cut.lastIndexOf(' ');
  const kept = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut;
  // Trailing punctuation reads as a typo next to the ellipsis ("programs,…").
  return `${kept.replace(/[\s,;:.!?–—-]+$/, '')}…`;
};

// Long partner-project titles need to step down a size or they wrap to four
// lines and collide with the description.
const titleFontSize = (title: string) => {
  if (title.length <= 24) return 78;
  if (title.length <= 44) return 64;
  return 52;
};

const root: CSSProperties = {
  width: OG_IMAGE_WIDTH,
  height: OG_IMAGE_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '64px 80px 56px',
  backgroundColor: BACKGROUND,
  fontFamily: 'Karla',
};

export interface CardProps {
  title: string;
  description: string;
  wordmarkDataUri: string;
}

export const Card = ({ title, description, wordmarkDataUri }: CardProps) => {
  const heading = truncate(title, TITLE_LIMIT);

  return (
    <div style={root}>
      {/* Brand rule bleeding across the top edge. */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: OG_IMAGE_WIDTH,
          height: 14,
          backgroundImage: `linear-gradient(90deg, ${BLUE} 0%, ${MINT} 100%)`,
        }}
      />

      <div style={{ display: 'flex' }}>
        <img
          src={wordmarkDataUri}
          width={WORDMARK_WIDTH}
          height={WORDMARK_HEIGHT}
          alt=""
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            fontSize: titleFontSize(heading),
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: INK,
          }}
        >
          {heading}
        </div>

        <div
          style={{
            width: 104,
            height: 8,
            marginTop: 28,
            borderRadius: 4,
            backgroundColor: BLUE,
          }}
        />

        <div
          style={{
            display: 'flex',
            marginTop: 28,
            maxWidth: 940,
            fontSize: 30,
            lineHeight: 1.4,
            color: GRAY,
          }}
        >
          {truncate(description, DESCRIPTION_LIMIT)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          fontSize: 26,
          fontWeight: 700,
          color: BLUE,
        }}
      >
        {SITE_DOMAIN}
      </div>
    </div>
  );
};
