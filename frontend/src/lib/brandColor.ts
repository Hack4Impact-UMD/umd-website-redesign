/**
 * A nonprofit's brand colour, read from its logo, for the panel behind the
 * project's screenshot on cards. Pure, so it is shared by the build-time
 * loader and the tests; the pixels come from sharp at build time.
 */

const HUE_BINS = 12;

type Rgb = [number, number, number];

const toHsl = ([r, g, b]: Rgb) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h =
    max === rn ? ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6 : max === gn ? ((bn - rn) / d + 2) / 6 : ((rn - gn) / d + 4) / 6;
  return { h, s, l };
};

const toRgb = (h: number, s: number, l: number): Rgb => {
  if (s === 0) return [l, l, l].map((v) => Math.round(v * 255)) as Rgb;
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const channel = (t: number) => {
    const u = t < 0 ? t + 1 : t > 1 ? t - 1 : t;
    if (u < 1 / 6) return p + (q - p) * 6 * u;
    if (u < 1 / 2) return q;
    if (u < 2 / 3) return p + (q - p) * (2 / 3 - u) * 6;
    return p;
  };
  return [channel(h + 1 / 3), channel(h), channel(h - 1 / 3)].map((v) => Math.round(v * 255)) as Rgb;
};

const toHex = (rgb: Rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;

/**
 * The logo's dominant colour: transparent, near-white, near-black and grey
 * pixels are ignored (backgrounds, outlines, text), the rest are grouped by
 * hue, and the heaviest group's average wins. Pixels count by their chroma,
 * so the anti-aliased edge where a colour meets a black outline barely does.
 * Undefined
 * for a logo with no real colour, such as a black wordmark.
 */
export const dominantColor = (pixels: Uint8Array | Buffer, channels: number): string | undefined => {
  const bins = Array.from({ length: HUE_BINS }, () => ({ weight: 0, r: 0, g: 0, b: 0 }));
  for (let i = 0; i + channels - 1 < pixels.length; i += channels) {
    if (channels === 4 && pixels[i + 3] < 128) continue;
    const rgb: Rgb = [pixels[i], pixels[i + 1], pixels[i + 2]];
    const { h, s, l } = toHsl(rgb);
    if (s < 0.25 || l > 0.92 || l < 0.08) continue;
    const chroma = s * (1 - Math.abs(2 * l - 1));
    const bin = bins[Math.min(HUE_BINS - 1, Math.floor(h * HUE_BINS))];
    bin.weight += chroma;
    bin.r += rgb[0] * chroma;
    bin.g += rgb[1] * chroma;
    bin.b += rgb[2] * chroma;
  }
  const best = bins.reduce((a, b) => (b.weight > a.weight ? b : a));
  if (best.weight === 0) return undefined;
  return toHex([best.r, best.g, best.b].map((v) => Math.round(v / best.weight)) as Rgb);
};

/** Oranges through yellows (about 32° to 72°) turn brown when darkened. */
const isWarmYellow = (h: number) => h >= 0.09 && h <= 0.2;

/**
 * A brand colour deep enough to sit behind a white browser frame or a dark
 * phone: lightness held between 22% and 36%, saturation capped so a neon logo
 * does not turn into a neon panel. Golds and oranges sit between 40% and 46%
 * so they stay gold rather than going olive.
 */
export const panelColor = (hex: string): string => {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb;
  const { h, s, l } = toHsl(rgb);
  const [floor, ceiling] = isWarmYellow(h) ? [0.4, 0.46] : [0.22, 0.36];
  return toHex(toRgb(h, Math.min(s, isWarmYellow(h) ? 0.85 : 0.8), Math.min(ceiling, Math.max(floor, l))));
};
