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
