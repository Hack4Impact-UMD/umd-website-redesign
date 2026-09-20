import { Timestamp } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { db } from '../firebase';

/**
 * Netlify build-hook throttling.
 *
 * The public site is prerendered, so a CMS edit only reaches visitors after a
 * rebuild. Editors save fields one at a time, so a naive trigger starts a build
 * per keystroke-save.
 *
 * This uses a leading-edge throttle with a trailing sweep: the first write in a
 * quiet period starts a build immediately, and later writes inside the cooldown
 * only record that a rebuild is pending. A scheduled sweep then flushes that
 * pending flag once the cooldown ends. A burst of edits therefore costs at most
 * two builds instead of one per save.
 */

export const BUILD_STATE_COLLECTION = 'system_build';
export const BUILD_STATE_DOCUMENT = 'netlify';
export const COOLDOWN_MS = 5 * 60 * 1000;

/** Rebuild at least this often, so time-dependent pages cannot go far stale. */
export const MAX_BUILD_AGE_MS = 24 * 60 * 60 * 1000;

export interface BuildState {
  lastTriggeredAt?: Timestamp;
  pendingSince?: Timestamp | null;
  lastReason?: string;
}

/**
 * The hook URL is a bearer credential: anyone who holds it can start builds.
 * Validate its shape so a misconfigured secret fails here instead of sending a
 * POST somewhere unintended.
 */
export const assertBuildHookUrl = (raw: string): string => {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error('NETLIFY_BUILD_HOOK_URL must be a valid URL');
  }

  if (
    url.protocol !== 'https:' ||
    url.hostname !== 'api.netlify.com' ||
    !url.pathname.startsWith('/build_hooks/') ||
    url.username ||
    url.password
  ) {
    throw new Error(
      'NETLIFY_BUILD_HOOK_URL must be an https://api.netlify.com/build_hooks/... URL without credentials',
    );
  }
  return url.toString();
};

/** Netlify shows this in the deploy list. Keep it short and readable. */
const MAX_TITLE_LENGTH = 120;

/**
 * Build the hook address with the deploy title attached.
 *
 * Netlify reads trigger_title from the query string, not from the request
 * body. A JSON body is not the title: Netlify URL-encodes it and exposes it to
 * the build as INCOMING_HOOK_BODY, which nothing here reads.
 * https://docs.netlify.com/build/configure-builds/build-hooks/
 */
export const buildHookRequestUrl = (hookUrl: string, reason: string): string => {
  const url = new URL(hookUrl);
  url.searchParams.set('trigger_title', `content update: ${reason}`.slice(0, MAX_TITLE_LENGTH));
  return url.toString();
};

const postBuildHook = async (hookUrl: string, reason: string) => {
  // The documented example posts a body of '{}'.
  const response = await fetch(buildHookRequestUrl(hookUrl, reason), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // Never log the address: it is a credential.
    throw new Error(`Netlify build hook returned HTTP ${response.status}`);
  }
};

const stateRef = () => db.collection(BUILD_STATE_COLLECTION).doc(BUILD_STATE_DOCUMENT);

/**
 * Decide whether to build now, inside a transaction so concurrent writes to
 * different collections cannot both claim the same slot.
 */
const claimBuildSlot = async (reason: string, now: number): Promise<boolean> => {
  return db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(stateRef());
    const state = (snapshot.data() ?? {}) as BuildState;
    const lastTriggeredMs = state.lastTriggeredAt?.toMillis() ?? 0;

    if (now - lastTriggeredMs >= COOLDOWN_MS) {
      transaction.set(
        stateRef(),
        {
          lastTriggeredAt: Timestamp.fromMillis(now),
          pendingSince: null,
          lastReason: reason,
        },
        { merge: true },
      );
      return true;
    }

    if (!state.pendingSince) {
      transaction.set(
        stateRef(),
        { pendingSince: Timestamp.fromMillis(now), lastReason: reason },
        { merge: true },
      );
    }
    return false;
  });
};

/** Called by every content trigger. Starts a build, or records one as pending. */
export const requestRebuild = async (
  reason: string,
  hookUrl: string,
  now = Date.now(),
): Promise<'triggered' | 'throttled'> => {
  const claimed = await claimBuildSlot(reason, now);
  if (!claimed) {
    logger.info('rebuild.throttled', { reason });
    return 'throttled';
  }

  // POST after the transaction commits, so a failed request cannot roll the
  // cooldown back and let the next write start a second build immediately.
  await postBuildHook(hookUrl, reason);
  logger.info('rebuild.triggered', { reason });
  return 'triggered';
};

/**
 * Flush a pending rebuild once the cooldown has passed, and force one if the
 * last build is older than MAX_BUILD_AGE_MS.
 */
export const flushPendingRebuild = async (
  hookUrl: string,
  now = Date.now(),
): Promise<'triggered' | 'idle'> => {
  const reason = await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(stateRef());
    const state = (snapshot.data() ?? {}) as BuildState;
    const lastTriggeredMs = state.lastTriggeredAt?.toMillis() ?? 0;

    if (now - lastTriggeredMs < COOLDOWN_MS) return null;

    const hasPending = Boolean(state.pendingSince);
    const isStale = now - lastTriggeredMs >= MAX_BUILD_AGE_MS;
    if (!hasPending && !isStale) return null;

    transaction.set(
      stateRef(),
      {
        lastTriggeredAt: Timestamp.fromMillis(now),
        pendingSince: null,
        lastReason: hasPending ? 'pending edits' : 'scheduled refresh',
      },
      { merge: true },
    );
    return hasPending ? 'pending edits' : 'scheduled refresh';
  });

  if (!reason) return 'idle';

  await postBuildHook(hookUrl, reason);
  logger.info('rebuild.flushed', { reason });
  return 'triggered';
};
