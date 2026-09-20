import type { ApplicationStatus } from './types';

/**
 * Hard close for the student application cycle, independent of the CMS.
 *
 * The CMS `applicationStatus.state` says whether a cycle is open; this says
 * when it ends regardless. Both must agree for the CTAs to activate, so
 * forgetting to flip the CMS field cannot leave a dead application link live.
 *
 * Update this each cycle. Because it is a module constant rather than content,
 * it cannot be changed from FireCMS -- and under static prerendering it is
 * evaluated at build time, so a change needs a rebuild to take effect.
 */
export const APPLICATION_CLOSES_AT_ET = '2026-08-04T00:00:00-04:00';

export const APPLICATION_CLOSES_AT_MS = new Date(APPLICATION_CLOSES_AT_ET).getTime();

/**
 * Whether the student application is open at `now`.
 *
 * `now` is a parameter rather than an internal Date.now() call so this can be
 * asserted at fixed instants either side of the deadline. Tests that rely on
 * the wall clock pass until the deadline passes and then fail forever, which
 * is exactly what happened to the previous StudentApply test in August 2026.
 */
export const isStudentApplicationOpen = (status: ApplicationStatus, now = Date.now()) =>
  status.state === 'open' && now < APPLICATION_CLOSES_AT_MS;
