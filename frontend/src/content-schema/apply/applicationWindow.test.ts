import { describe, expect, it } from 'vitest';

import {
  APPLICATION_CLOSES_AT_MS,
  isStudentApplicationOpen,
} from './applicationWindow';
import type { ApplicationStatus } from './types';

const status = (state: ApplicationStatus['state']): ApplicationStatus => ({
  state,
  label: 'Applications are open.',
  applicationUrl: 'https://example.org/apply',
});

const A_MINUTE = 60_000;

describe('isStudentApplicationOpen', () => {
  // `now` is always injected. The test this replaced read the wall clock, so
  // it passed until the deadline elapsed and then failed permanently.
  it('is open before the deadline when the CMS says the cycle is open', () => {
    expect(isStudentApplicationOpen(status('open'), APPLICATION_CLOSES_AT_MS - A_MINUTE)).toBe(true);
  });

  it('is closed once the deadline passes, whatever the CMS says', () => {
    expect(isStudentApplicationOpen(status('open'), APPLICATION_CLOSES_AT_MS + A_MINUTE)).toBe(false);
  });

  it('treats the deadline instant itself as closed', () => {
    expect(isStudentApplicationOpen(status('open'), APPLICATION_CLOSES_AT_MS)).toBe(false);
  });

  it.each(['closed', 'comingSoon'] as const)(
    'stays closed for state %s even well before the deadline',
    (state) => {
      expect(isStudentApplicationOpen(status(state), APPLICATION_CLOSES_AT_MS - A_MINUTE)).toBe(false);
    },
  );

  it('requires both signals to agree, so neither alone can open the application', () => {
    const beforeDeadline = APPLICATION_CLOSES_AT_MS - A_MINUTE;
    const afterDeadline = APPLICATION_CLOSES_AT_MS + A_MINUTE;

    expect(isStudentApplicationOpen(status('open'), beforeDeadline)).toBe(true);
    expect(isStudentApplicationOpen(status('closed'), beforeDeadline)).toBe(false);
    expect(isStudentApplicationOpen(status('open'), afterDeadline)).toBe(false);
    expect(isStudentApplicationOpen(status('closed'), afterDeadline)).toBe(false);
  });

  it('parses the deadline constant into a real instant', () => {
    expect(Number.isNaN(APPLICATION_CLOSES_AT_MS)).toBe(false);
  });
});
