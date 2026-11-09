import { describe, expect, it } from 'vitest';

import { cardScreenshot, screenshotFrame } from './screenshots';

const resolve = (url: string) => (url.startsWith('javascript:') ? null : url);

describe('screenshotFrame', () => {
  it('frames phone-shaped captures as phones and everything else, or unknown, as a browser', () => {
    expect(screenshotFrame(390, 844)).toBe('phone');
    expect(screenshotFrame(1920, 1056)).toBe('browser');
    expect(screenshotFrame(1024, 1366)).toBe('browser');
    expect(screenshotFrame()).toBe('browser');
  });
});

describe('cardScreenshot', () => {
  it("uses the project's first screenshot, with its frame", () => {
    expect(
      cardScreenshot(
        {
          screenshots: {
            data: [
              { attributes: { url: '/api/media/projects/1/phone.png', width: 390, height: 844 } },
              { attributes: { url: '/api/media/projects/1/desktop.png', width: 1920, height: 1056 } },
            ],
          },
          image: { data: [{ attributes: { url: '/api/media/projects/1/logo.png' } }] },
          brandColor: '#1f4d7a',
        },
        resolve,
      ),
    ).toEqual({
      src: '/api/media/projects/1/phone.png',
      frame: 'phone',
      width: 390,
      height: 844,
      color: '#1f4d7a',
      logoUrl: '/api/media/projects/1/logo.png',
    });
  });

  it('has none when the project has no screenshots or the first cannot be served', () => {
    const noImage = { image: { data: [] } };
    expect(cardScreenshot(noImage, resolve)).toBeUndefined();
    expect(cardScreenshot({ ...noImage, screenshots: { data: [] } }, resolve)).toBeUndefined();
    expect(
      cardScreenshot({ ...noImage, screenshots: { data: [{ attributes: { url: 'javascript:alert(1)' } }] } }, resolve),
    ).toBeUndefined();
  });
});
