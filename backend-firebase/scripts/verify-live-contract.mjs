import { createHash } from 'node:crypto';

const DEFAULT_BASE_URL =
  'https://us-central1-umd-website-f3e79.cloudfunctions.net/api';
const EXPECTED_PROJECT_TOTAL = Number(process.env.EXPECTED_PROJECT_TOTAL ?? 32);
const EXPECTED_MEMBER_TOTAL = Number(process.env.EXPECTED_MEMBER_TOTAL ?? 212);
const EXPECTED_PROJECT_CHECKSUM =
  process.env.EXPECTED_PROJECT_CHECKSUM ??
  '99471f139b776d82a10d30cb8d9956a45c325cae81c597e77b595ce479e5f8d6';
const EXPECTED_MEMBER_CHECKSUM =
  process.env.EXPECTED_MEMBER_CHECKSUM ??
  'eb21bfba1cf37b9d88c54ee5be17a57872e480f8aff9d1766bfa775a2f6f72e8';

const baseUrl = (process.env.API_BASE_URL ?? DEFAULT_BASE_URL).replace(/\/+$/, '');

const getJson = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) {
    throw new Error(`GET ${url} failed with ${response.status}`);
  }
  return response.json();
};

const sha256 = (lines) =>
  createHash('sha256').update(`${lines.join('\n')}\n`).digest('hex');

const fetchCollection = async (name) => {
  const records = [];
  let page = 1;
  let pageCount = 1;
  let total = 0;

  do {
    const query = new URLSearchParams({
      'pagination[page]': String(page),
      'pagination[pageSize]': '250',
    });
    const payload = await getJson(`${baseUrl}/${name}?${query}`);
    if (!Array.isArray(payload.data) || !payload.meta?.pagination) {
      throw new Error(`${name} returned an unexpected collection envelope`);
    }
    records.push(...payload.data);
    pageCount = payload.meta.pagination.pageCount;
    total = payload.meta.pagination.total;
    page += 1;
  } while (page <= pageCount);

  if (records.length !== total) {
    throw new Error(`${name} returned ${records.length} records but reported ${total}`);
  }
  return { records, total };
};

const numericIdSort = (left, right) => Number(left.id) - Number(right.id);

const verifyContent = async () => {
  const sections = new Map([
    ['home', 'content_home'],
    ['about', 'content_about'],
    ['our-work', 'content_our_work'],
    ['apply/student', 'content_apply_student'],
    ['apply/nonprofit', 'content_apply_nonprofit'],
    ['site-settings', 'content_site_settings'],
  ]);
  for (const [section, collection] of sections) {
    const payload = await getJson(`${baseUrl}/content/${section}`);
    if (
      payload.data === null ||
      payload.meta?.collection !== collection ||
      payload.meta?.documentId !== 'main'
    ) {
      throw new Error(`content/${section} did not match ${collection}/main`);
    }
  }
  return sections.size;
};

const verifyMedia = async (projects) => {
  const mediaPath = projects
    .flatMap((project) => project.attributes?.image?.data ?? [])
    .map((image) => image.attributes?.url)
    .find((url) => typeof url === 'string' && url.startsWith('/api/media/'));
  if (!mediaPath) throw new Error('No project media path was available for verification');

  const response = await fetch(`${new URL(baseUrl).origin}${mediaPath}`, {
    signal: AbortSignal.timeout(20_000),
  });
  await response.body?.cancel();
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Media verification failed with ${response.status}`);
  }
  return true;
};

const main = async () => {
  const health = await getJson(`${baseUrl}/health`);
  if (health.status !== 'ok') throw new Error('Health endpoint is not ok');

  const [projectsResult, membersResult] = await Promise.all([
    fetchCollection('projects'),
    fetchCollection('members'),
  ]);
  const projects = [...projectsResult.records].sort(numericIdSort);
  const members = [...membersResult.records].sort(numericIdSort);
  const projectChecksum = sha256(
    projects.map((project) => `${String(project.id)}\t${project.attributes?.path ?? ''}`),
  );
  const memberChecksum = sha256(members.map((member) => String(member.id)));

  const mismatches = [];
  if (projectsResult.total !== EXPECTED_PROJECT_TOTAL) {
    mismatches.push(`projects total ${projectsResult.total} != ${EXPECTED_PROJECT_TOTAL}`);
  }
  if (membersResult.total !== EXPECTED_MEMBER_TOTAL) {
    mismatches.push(`members total ${membersResult.total} != ${EXPECTED_MEMBER_TOTAL}`);
  }
  if (projectChecksum !== EXPECTED_PROJECT_CHECKSUM) {
    mismatches.push(`projects checksum ${projectChecksum} != ${EXPECTED_PROJECT_CHECKSUM}`);
  }
  if (memberChecksum !== EXPECTED_MEMBER_CHECKSUM) {
    mismatches.push(`members checksum ${memberChecksum} != ${EXPECTED_MEMBER_CHECKSUM}`);
  }
  if (mismatches.length > 0) throw new Error(mismatches.join('; '));

  const [contentSections] = await Promise.all([
    verifyContent(),
    verifyMedia(projects),
  ]);

  console.log(
    JSON.stringify(
      {
        baseUrl,
        health: health.status,
        projects: { total: projectsResult.total, checksum: projectChecksum },
        members: { total: membersResult.total, checksum: memberChecksum },
        contentSections,
        mediaReadable: true,
      },
      null,
      2,
    ),
  );
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
