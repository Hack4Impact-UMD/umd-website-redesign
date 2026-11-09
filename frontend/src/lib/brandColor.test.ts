import { describe, expect, it } from 'vitest';

import { dominantColor, panelColor } from './brandColor';

const pixels = (...colors: Array<[number, number, number, number]>) => Uint8Array.from(colors.flat());

describe('dominantColor', () => {
  it('picks the strongest hue and ignores transparent, white, black and grey pixels', () => {
    const red: [number, number, number, number] = [228, 0, 43, 255];
    const result = dominantColor(
      pixels(red, red, red, [0, 120, 200, 255], [255, 255, 255, 255], [0, 0, 0, 255], [128, 128, 128, 255], [0, 200, 0, 0]),
      4,
    );
    expect(result).toBe('#e4002b');
  });

  it('discounts dim pixels where a colour blends into a black outline', () => {
    const gold: [number, number, number, number] = [200, 160, 0, 255];
    const edge: [number, number, number, number] = [48, 40, 0, 255];
    const red = parseInt(dominantColor(pixels(gold, gold, edge, edge, edge, edge), 4)!.slice(1, 3), 16);
    // A plain average of these six pixels has a red of 99; the gold's is 200.
    expect(red).toBeGreaterThan(140);
  });

  it('has no colour for a monochrome logo', () => {
    expect(dominantColor(pixels([0, 0, 0, 255], [255, 255, 255, 255], [90, 90, 90, 255]), 4)).toBeUndefined();
  });
});

describe('panelColor', () => {
  it('deepens light colours and keeps already-deep ones', () => {
    const light = panelColor('#66bb44');
    const deep = panelColor('#1f4d7a');
    expect(light).not.toBe('#66bb44');
    expect(deep).toBe('#1f4d7a');
    // Lightness lands at the 36% ceiling.
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(light.slice(i, i + 2), 16) / 255);
    expect(((Math.max(r, g, b) + Math.min(r, g, b)) / 2).toFixed(2)).toBe('0.36');
  });

  it('keeps gold gold: bright golds come down to 46% and dark ones up to 40%', () => {
    const lightness = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
      return ((Math.max(r, g, b) + Math.min(r, g, b)) / 2).toFixed(2);
    };
    expect(lightness(panelColor('#f2c418'))).toBe('0.46');
    expect(lightness(panelColor('#a08000'))).toBe('0.40');
  });
});
