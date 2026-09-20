import { defineSecret } from 'firebase-functions/params';
import { onDocumentWritten } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions';
import { API_REGION } from '../config';
import { assertBuildHookUrl, flushPendingRebuild, requestRebuild } from './buildHook';

/**
 * Set with `firebase functions:secrets:set NETLIFY_BUILD_HOOK_URL`.
 * Never put this in firebase.json, .env, or the repository.
 */
const NETLIFY_BUILD_HOOK_URL = defineSecret('NETLIFY_BUILD_HOOK_URL');

/**
 * Collections that change what the prerendered site shows.
 *
 * Declared one at a time on purpose. A {collection}/{documentId} wildcard would
 * also fire on every future internal collection, including the build-state
 * document this feature writes, which would make the trigger retrigger itself.
 */
const WATCHED_COLLECTIONS = [
  'content_home',
  'content_about',
  'content_our_work',
  'content_apply_student',
  'content_apply_nonprofit',
  'content_site_settings',
  'projects',
  'members',
] as const;

const triggerOptions = (document: string) => ({
  document,
  region: API_REGION,
  secrets: [NETLIFY_BUILD_HOOK_URL],
  // A failed build request is picked up by the scheduled sweep, so retrying
  // here would only add duplicate builds.
  retry: false,
  maxInstances: 5,
});

const handleWrite = async (collection: string) => {
  try {
    await requestRebuild(collection, assertBuildHookUrl(NETLIFY_BUILD_HOOK_URL.value()));
  } catch (error) {
    // Never fail loudly enough to retry: the sweep is the safety net.
    logger.error('rebuild.request-failed', { collection, error: String(error) });
  }
};

export const onContentHomeWrite = onDocumentWritten(
  triggerOptions('content_home/{documentId}'),
  () => handleWrite('content_home'),
);
export const onContentAboutWrite = onDocumentWritten(
  triggerOptions('content_about/{documentId}'),
  () => handleWrite('content_about'),
);
export const onContentOurWorkWrite = onDocumentWritten(
  triggerOptions('content_our_work/{documentId}'),
  () => handleWrite('content_our_work'),
);
export const onContentApplyStudentWrite = onDocumentWritten(
  triggerOptions('content_apply_student/{documentId}'),
  () => handleWrite('content_apply_student'),
);
export const onContentApplyNonprofitWrite = onDocumentWritten(
  triggerOptions('content_apply_nonprofit/{documentId}'),
  () => handleWrite('content_apply_nonprofit'),
);
export const onContentSiteSettingsWrite = onDocumentWritten(
  triggerOptions('content_site_settings/{documentId}'),
  () => handleWrite('content_site_settings'),
);
export const onProjectWrite = onDocumentWritten(
  triggerOptions('projects/{documentId}'),
  () => handleWrite('projects'),
);
export const onMemberWrite = onDocumentWritten(
  triggerOptions('members/{documentId}'),
  () => handleWrite('members'),
);

/**
 * Flushes a rebuild that the cooldown deferred, and forces one if the last
 * build is a day old. The daily floor matters because the student application
 * deadline is evaluated at build time.
 */
export const flushRebuild = onSchedule(
  {
    schedule: 'every 5 minutes',
    region: API_REGION,
    secrets: [NETLIFY_BUILD_HOOK_URL],
    maxInstances: 1,
  },
  async () => {
    try {
      await flushPendingRebuild(assertBuildHookUrl(NETLIFY_BUILD_HOOK_URL.value()));
    } catch (error) {
      logger.error('rebuild.flush-failed', { error: String(error) });
    }
  },
);

export { WATCHED_COLLECTIONS };
