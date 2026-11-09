/**
 * Phone captures run about 2:1 (390×844 and the like); desktop and tablet
 * captures are landscape or close to square. Anything at least half again as
 * tall as it is wide is treated as a phone screen.
 */
const PHONE_MIN_ASPECT = 1.5;

export type ScreenshotFrame = 'browser' | 'phone';

/** Without both dimensions the shape is unknown, so the browser frame is the default. */
export const screenshotFrame = (width?: number, height?: number): ScreenshotFrame =>
  width && height && height / width >= PHONE_MIN_ASPECT ? 'phone' : 'browser';

export interface CardScreenshot {
  src: string;
  frame: ScreenshotFrame;
  width?: number;
  height?: number;
  /** The partner's brand colour for the panel behind it; navy without one. */
  color?: string;
  /** The partner logo, shown on a tile beside the screenshot. */
  logoUrl?: string;
}

type CardProjectFields = {
  screenshots?: { data: Array<{ attributes: { url: string; width?: number; height?: number } }> };
  image: { data: Array<{ attributes: { url: string } }> };
  brandColor?: string;
};

/**
 * What a project card shows when the project has a screenshot: its first one,
 * the same as its page hero, with the partner's colour and logo. Undefined
 * when it has none, so the card keeps its plain logo treatment.
 */
export const cardScreenshot = (
  project: CardProjectFields,
  resolve: (url: string) => string | null | undefined,
): CardScreenshot | undefined => {
  const first = project.screenshots?.data[0]?.attributes;
  const src = first ? resolve(first.url) : undefined;
  if (!first || !src) return undefined;
  const logo = project.image.data[0]?.attributes.url;
  return {
    src,
    frame: screenshotFrame(first.width, first.height),
    width: first.width,
    height: first.height,
    color: project.brandColor,
    logoUrl: (logo && resolve(logo)) || undefined,
  };
};
