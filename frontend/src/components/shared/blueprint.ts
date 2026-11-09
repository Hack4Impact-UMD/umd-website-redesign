import type { CSSProperties } from 'react';

/**
 * A faint drafting grid in the brand blue, fading out towards the edges: the
 * backdrop wherever the site shows the product a team built.
 */
export const BLUEPRINT_GRID: CSSProperties = {
  backgroundImage:
    'linear-gradient(to right, rgb(0 105 202 / 0.16) 1px, transparent 1px),' +
    'linear-gradient(to bottom, rgb(0 105 202 / 0.16) 1px, transparent 1px)',
  backgroundSize: '32px 32px',
  maskImage: 'radial-gradient(ellipse 70% 65% at 50% 55%, black 30%, transparent 100%)',
  WebkitMaskImage: 'radial-gradient(ellipse 70% 65% at 50% 55%, black 30%, transparent 100%)',
};

/** The same grid at card scale. */
export const BLUEPRINT_GRID_SMALL: CSSProperties = { ...BLUEPRINT_GRID, backgroundSize: '20px 20px' };

/** The card-scale grid in white, for panels in a partner's brand colour. */
export const BLUEPRINT_GRID_SMALL_ON_COLOR: CSSProperties = {
  ...BLUEPRINT_GRID_SMALL,
  backgroundImage:
    'linear-gradient(to right, rgb(255 255 255 / 0.09) 1px, transparent 1px),' +
    'linear-gradient(to bottom, rgb(255 255 255 / 0.09) 1px, transparent 1px)',
};
