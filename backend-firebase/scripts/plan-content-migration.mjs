import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

import { CONTENT_SECTIONS, inspectContentDocument } from './content-contract.mjs';

export { CONTENT_SECTIONS };

const STUDENT_APPLICATION_URL = 'https://apply.umd.hack4impact.org/login';
const NONPROFIT_APPLICATION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link';

const clone = (value) => JSON.parse(JSON.stringify(value));
const isRecord = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const ensureLink = (links, link) => {
  const values = Array.isArray(links) ? clone(links) : [];
  if (!values.some((candidate) => isRecord(candidate) && candidate.href === link.href)) {
    values.push(link);
  }
  return values;
};

const scrubApplicationCampaign = (payload, section) => {
  const applicationUrl =
    section === 'apply/student' ? STUDENT_APPLICATION_URL : NONPROFIT_APPLICATION_URL;
  const next = clone(payload);
  next.applicationStatus = {
    state: 'closed',
    label: 'Applications are currently closed. Check back for the next application cycle.',
    applicationUrl,
  };
  next.testimonials = [];
  if (isRecord(next.intro)) {
    next.intro.ctaLabel = 'Applications closed';
    delete next.intro.ctaHref;
  }
  if (isRecord(next.cta)) {
    next.cta.primaryLabel = 'Applications closed';
    delete next.cta.primaryHref;
  }
  if (section === 'apply/nonprofit') {
    next.banner = { enabled: false, text: '' };
  }
  return next;
};

const retainSharedDestinations = (payload) => {
  const next = clone(payload);
  if (isRecord(next.navbar)) {
    next.navbar.links = ensureLink(next.navbar.links, { label: 'Contact Us', href: '/contactus' });
  }
  if (isRecord(next.footer)) {
    next.footer.exploreLinks = ensureLink(next.footer.exploreLinks, {
      label: 'Contact Us',
      href: '/contactus',
    });
    next.footer.exploreLinks = ensureLink(next.footer.exploreLinks, {
      label: 'TerpLink',
      href: 'https://terplink.umd.edu/organization/hack4impact',
    });
  }
  return next;
};

export const planContentDocumentMigration = (section, document) => {
  if (!CONTENT_SECTIONS.includes(section)) {
    throw new Error(`Unsupported content section: ${section}`);
  }
  if (document === null || document === undefined) {
    return { action: 'needs-review', issue: 'missing-document', document: document ?? null };
  }
  if (!isRecord(document)) {
    return { action: 'needs-review', issue: 'invalid-document', document: clone(document) };
  }
  const inspection = inspectContentDocument(section, document);
  if (inspection.valid) {
    return { action: 'unchanged', document: clone(document) };
  }
  if (inspection.issue !== 'legacy-document') {
    return {
      action: 'needs-review',
      issue: inspection.issue,
      ...(inspection.path ? { path: inspection.path } : {}),
      document: clone(document),
    };
  }

  let payload = clone(document);
  if (section.startsWith('apply/')) payload = scrubApplicationCampaign(payload, section);
  if (section === 'site-settings') payload = retainSharedDestinations(payload);
  if (section === 'our-work' && isRecord(payload.header) && payload.header.title === 'Past Project Library') {
    payload.header.title = 'Project Library';
  }

  return {
    action: 'wrap-as-placeholder',
    document: { mode: 'placeholder', verifiedAt: null, payload },
  };
};

export const planContentMigration = (documents) => {
  if (!isRecord(documents)) throw new Error('Content export must be a JSON object.');
  const missingSections = CONTENT_SECTIONS.filter((section) => !Object.hasOwn(documents, section));
  if (missingSections.length > 0) {
    throw new Error(`Content export is missing: ${missingSections.join(', ')}`);
  }
  return Object.fromEntries(
    CONTENT_SECTIONS.map((section) => [
      section,
      planContentDocumentMigration(section, documents[section]),
    ]),
  );
};

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  const inputPath = process.argv[2];
  if (!inputPath) {
    throw new Error('Usage: node plan-content-migration.mjs <legacy-content.json>');
  }
  const input = JSON.parse(await readFile(inputPath, 'utf8'));
  process.stdout.write(`${JSON.stringify(planContentMigration(input), null, 2)}\n`);
}
