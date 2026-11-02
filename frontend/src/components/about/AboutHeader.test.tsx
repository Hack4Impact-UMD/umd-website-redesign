import { describe, expect, it } from 'vitest';

import { firstSentence } from './AboutHeader';

describe('firstSentence', () => {
  it('keeps only the first sentence, including abbreviations without periods like 501(c)(3)', () => {
    expect(
      firstSentence('We are a 501(c)(3) chapter at UMD. We build software for nonprofits.'),
    ).toBe('We are a 501(c)(3) chapter at UMD.');
  });

  it('returns text without sentence punctuation unchanged', () => {
    expect(firstSentence('Student-led software for social good')).toBe('Student-led software for social good');
  });
});
