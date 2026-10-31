/**
 * Converts the Fall 2026 roster form export into members and projects JSON
 * shaped like the FireCMS `members` and `projects` collections.
 *
 * Each output file is an object keyed by the document ID it would be written
 * to. Dates are ISO date strings, relations are plain ID arrays, and avatars
 * still point at the Google Drive uploads from the form.
 *
 * Usage:
 *   node convert-roster.mjs [csv] [outDir]
 *
 * Defaults to data/h4i_members_f26.csv and data/. Only reads the CSV and
 * writes the two JSON files; nothing touches Firestore. Rows that need a human
 * decision are reported on stderr.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const COLUMNS = {
  timestamp: 'Timestamp',
  name: 'First and Last Name',
  currentRole: 'Current H4I Role and Team',
  linkedin: 'LinkedIn',
  previousRoles: 'Previous Role(s) and Team(s) if Applicable',
  shared: 'Which items would you like shared in the directory?',
  headshotConsent: 'Would you like your headshot featured on the Hack4Impact website?',
  headshot: 'Please upload your headshot if you answered yes to the previous question.',
};

const FALL_2026_START = '2026-09-01';
const SPRING_2026_START = '2026-02-01';

const PROJECTS = [
  { title: 'Sustainable Saratoga', pattern: /saratoga/i },
  { title: 'Hagar International', pattern: /hagar/i },
  { title: 'SeedMoney', pattern: /seed ?money/i },
  { title: 'Friends of Mount Vernon Trail', pattern: /\bmvt\b|mount vernon|fomvt/i },
  { title: 'Rockville Science Center', pattern: /rockville/i },
  { title: 'Long Term Success', pattern: /\blts\b|long term success/i },
  { title: 'The Dented Puck Foundation', pattern: /dented/i },
].map((project) => ({ ...project, startDate: FALL_2026_START, isCurrentProject: true }));

const PAST_PROJECTS = [
  {
    title: 'Kisses for Kyle',
    pattern: /kisses for kyle/i,
    startDate: SPRING_2026_START,
    isCurrentProject: false,
    isFeatured: true,
  },
];

// Ordered: the first match wins, so "Tech Lead" is checked before "Engineer".
const PROJECT_ROLES = [
  { title: 'Tech Lead', pattern: /tech lead|\btl\b/i },
  { title: 'Product Manager', pattern: /\bpm\b|product manager/i },
  { title: 'Designer', pattern: /designer/i },
  { title: 'Engineer', pattern: /\bengineer\b/i },
];

// Titles match EXEC_ORDER in frontend MembersSection so board sorting works.
const BOARD_ROLES = [
  { title: 'Executive Director', pattern: /executive director/i },
  { title: 'Director of Engineering', pattern: /director of engineering/i },
  { title: 'Director of Product', pattern: /director of product/i },
  { title: 'Director of Education', pattern: /director of education/i },
  { title: 'Director of Design', pattern: /director of design/i },
  { title: 'Director of Finance and Sponsorship', pattern: /director of finance/i },
  { title: 'Director of Events', pattern: /director of events/i },
  { title: 'Director of Recruitment', pattern: /director of recruitment/i },
  // Deputy directors are not board seats; their project role is used instead.
  { title: 'Director of Public Relations and Outreach', pattern: /(?<!deputy )director of pr/i },
];

const OUTREACH_PATTERN = /outreach|\bpr ?(?:&|and) ?o\b/i;
const BOOTCAMP_PATTERN = /bootcamp/i;

/** Rows whose name field is not a real submission. */
const EXCLUDED_NAMES = new Set(['henry test']);

/** Typos in the name field, keyed by the lowercased submitted name. */
const NAME_FIXES = {
  'cindy nguyeb': 'Cindy Nguyen',
  'anita danile': 'Anita Daniel',
  'sarayu jilludumudi': 'Sarayu Jilludumudi',
};

/** Names whose first name has more than one word. */
const MULTI_WORD_FIRST_NAMES = new Set(['tracy anne tan']);

/**
 * Current members who did not fill out the form, keyed by member ID. Details
 * come from their live Firestore document; the avatar is its storage path.
 */
const MANUAL_MEMBERS = {
  // Live member 289.
  'isabella-steinebach': {
    firstName: 'Isabella',
    lastName: 'Steinebach',
    pronouns: 'she/her',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Executive Director', isDisplayRole: true }],
    avatar: { url: 'members/289/avatar.png', alt: 'Headshot of Isabella Steinebach' },
  },
  // Live member 155.
  'gavin-crisologo': {
    firstName: 'Gavin',
    lastName: 'Crisologo',
    pronouns: 'he/him',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Senior Advisor', isDisplayRole: true }],
    avatar: { url: 'members/155/avatar.jpg', alt: 'Headshot of Gavin Crisologo' },
  },
  // Live member 203.
  'kalpana-iyer': {
    firstName: 'Kalpana',
    lastName: 'Iyer',
    pronouns: 'she/her',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Senior Advisor', isDisplayRole: true }],
    avatar: { url: 'members/203/avatar.jpg', alt: 'Headshot of Kalpana Iyer' },
  },
  // Live member 258.
  'annie-nguyen': {
    firstName: 'Annie',
    lastName: 'Nguyen',
    pronouns: 'she/her',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Events', isDisplayRole: true }],
    avatar: { url: 'members/258/avatar.jpg', alt: 'Headshot of Annie Nguyen' },
  },
  'amber-li': {
    firstName: 'Amber',
    lastName: 'Li',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Education', isDisplayRole: true }],
    avatar: null,
  },
  'chloe-thompson': {
    firstName: 'Chloe',
    lastName: 'Thompson',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Finance and Sponsorship', isDisplayRole: true }],
    avatar: null,
  },
  'henry-harms': {
    firstName: 'Henry',
    lastName: 'Harms',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Events', isDisplayRole: true }],
    avatar: null,
  },
  'kathleen-lin': {
    firstName: 'Kathleen',
    lastName: 'Lin',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Finance and Sponsorship', isDisplayRole: true }],
    avatar: null,
  },
  'stuti-pardiwala': {
    firstName: 'Stuti',
    lastName: 'Pardiwala',
    memberDisplayStatus: 'Current Board Member',
    isBootcamp: false,
    projectIds: [],
    componentRolesArr: [{ title: 'Director of Public Relations and Outreach', isDisplayRole: true }],
    avatar: null,
  },
};

/**
 * Board titles for form respondents who gave only their project role, keyed
 * by member ID. The title becomes their display role; project roles stay.
 */
const EXTRA_BOARD_ROLES = {
  'laila-shakoor': 'Director of Recruitment',
};

/** RFC 4180 parser: quoted fields may contain commas, quotes, and newlines. */
const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...records] = rows.filter((candidate) => candidate.some((value) => value.trim()));
  return records.map((record) =>
    Object.fromEntries(header.map((column, index) => [column, (record[index] ?? '').trim()])),
  );
};

const slugify = (value) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const titleCase = (value) =>
  value.replace(/\S+/g, (word) =>
    word === word.toLowerCase() ? word[0].toUpperCase() + word.slice(1) : word,
  );

const parseTimestamp = (value) => {
  const match = value.match(/^(\d+)\/(\d+)\/(\d{4}) (\d+):(\d+):(\d+)$/);
  if (!match) return 0;
  const [, month, day, year, hour, minute, second] = match.map(Number);
  return Date.UTC(year, month - 1, day, hour, minute, second);
};

const splitName = (rawName) => {
  const key = rawName.toLowerCase().replace(/\s+/g, ' ');
  const fullName = NAME_FIXES[key] ?? titleCase(rawName.replace(/\s+/g, ' '));
  const words = fullName.split(' ');
  const firstNameWords = MULTI_WORD_FIRST_NAMES.has(fullName.toLowerCase()) ? 2 : 1;
  return {
    firstName: words.slice(0, firstNameWords).join(' '),
    lastName: words.slice(firstNameWords).join(' '),
  };
};

/** Returns a canonical https://www.linkedin.com/in/<slug> URL, or undefined. */
const normalizeLinkedin = (value) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const urlMatch = trimmed.match(/linkedin\.com\/in\/([^/?#\s]+)/i);
  const slug = urlMatch?.[1] ?? (/^[\w-]+$/.test(trimmed) ? trimmed : undefined);
  return slug ? `https://www.linkedin.com/in/${slug}` : undefined;
};

const findMatch = (value, candidates) =>
  candidates.find((candidate) => candidate.pattern.test(value));

/**
 * Collapses repeat submissions into one record per person. The newest
 * submission wins field by field, and blank fields fall back to older ones.
 */
const mergeSubmissions = (records) => {
  const byPerson = new Map();
  const sorted = [...records].sort(
    (a, b) => parseTimestamp(a[COLUMNS.timestamp]) - parseTimestamp(b[COLUMNS.timestamp]),
  );

  for (const record of sorted) {
    const key = record[COLUMNS.name].toLowerCase().replace(/\s+/g, ' ');
    if (EXCLUDED_NAMES.has(key)) continue;

    const previous = byPerson.get(key);
    if (!previous) {
      byPerson.set(key, { ...record, submissions: 1 });
      continue;
    }

    const merged = { ...previous, submissions: previous.submissions + 1 };
    for (const [column, value] of Object.entries(record)) {
      if (value) merged[column] = value;
    }
    // Consent is an answer, not a blank to fill: the newest one stands, and a
    // "No" must not inherit an older upload.
    merged[COLUMNS.headshot] = record[COLUMNS.headshot];
    byPerson.set(key, merged);
  }

  return [...byPerson.values()];
};

const buildRoles = (record, warnings, name) => {
  const currentRole = record[COLUMNS.currentRole];
  const roles = [];

  const board = findMatch(currentRole, BOARD_ROLES);
  if (board) roles.push({ title: board.title, isDisplayRole: false });

  const project = findMatch(currentRole, PROJECTS) ?? findMatch(currentRole, PAST_PROJECTS);
  const projectRole = findMatch(currentRole, PROJECT_ROLES);
  if (project) {
    if (projectRole) {
      roles.push({ title: projectRole.title, isDisplayRole: false, team: project.title });
    } else {
      warnings.push(`${name}: "${currentRole}" names ${project.title} but no role`);
    }
  } else if (projectRole) {
    roles.push({ title: projectRole.title, isDisplayRole: false });
    warnings.push(`${name}: "${currentRole}" has no project; role kept without a team`);
  } else if (!board && OUTREACH_PATTERN.test(currentRole)) {
    roles.push({ title: 'Outreach Coordinator', isDisplayRole: false });
  } else if (!board && BOOTCAMP_PATTERN.test(currentRole)) {
    roles.push({ title: 'Bootcamp', isDisplayRole: false });
  } else if (!board) {
    warnings.push(`${name}: could not read a role from "${currentRole}"`);
  }

  // Previous roles are only read for past projects that get a page this run.
  const previousRoles = record[COLUMNS.previousRoles];
  for (const segment of previousRoles.split(/[\n,;|]/)) {
    const pastProject = findMatch(segment, PAST_PROJECTS);
    if (!pastProject || roles.some((role) => role.team === pastProject.title)) continue;

    const pastRole = findMatch(segment, PROJECT_ROLES);
    if (pastRole) {
      roles.push({ title: pastRole.title, isDisplayRole: false, team: pastProject.title });
    } else {
      warnings.push(`${name}: previous role "${segment.trim()}" names ${pastProject.title} but no role`);
    }
  }

  // Display order of preference: board title, then a current-project role,
  // then anything else.
  const isCurrentTeam = (role) =>
    PROJECTS.some((candidate) => candidate.title === role.team);
  const displayRole =
    roles.find((role) => BOARD_ROLES.some((candidate) => candidate.title === role.title)) ??
    roles.find(isCurrentTeam) ??
    roles.find((role) => !role.team) ??
    roles[0];
  if (displayRole) displayRole.isDisplayRole = true;

  return roles;
};

const buildMember = (record, warnings) => {
  const { firstName, lastName } = splitName(record[COLUMNS.name]);
  const name = `${firstName} ${lastName}`;
  const sharesLinkedin = /linkedin/i.test(record[COLUMNS.shared]);
  const linkedinUrl = sharesLinkedin ? normalizeLinkedin(record[COLUMNS.linkedin]) : undefined;
  if (sharesLinkedin && record[COLUMNS.linkedin] && !linkedinUrl) {
    warnings.push(`${name}: "${record[COLUMNS.linkedin]}" is not a LinkedIn URL; dropped`);
  }

  const wantsHeadshot = /^yes$/i.test(record[COLUMNS.headshotConsent]);
  const headshotUrl = record[COLUMNS.headshot];
  if (wantsHeadshot && !headshotUrl) warnings.push(`${name}: consented to a headshot but uploaded none`);

  const componentRolesArr = buildRoles(record, warnings, name);
  const extraBoardRole = EXTRA_BOARD_ROLES[slugify(name)];
  if (extraBoardRole) {
    for (const role of componentRolesArr) role.isDisplayRole = false;
    componentRolesArr.unshift({ title: extraBoardRole, isDisplayRole: true });
  }
  const isBoardMember = componentRolesArr.some((role) =>
    BOARD_ROLES.some((candidate) => candidate.title === role.title),
  );
  const member = {
    firstName,
    lastName,
    memberDisplayStatus: isBoardMember ? 'Current Board Member' : 'Current Member',
    isBootcamp: componentRolesArr.some((role) => role.title === 'Bootcamp'),
    projectIds: [],
    componentRolesArr,
    avatar: wantsHeadshot && headshotUrl ? { url: headshotUrl, alt: `Headshot of ${name}` } : null,
  };
  if (linkedinUrl) member.linkedinUrl = linkedinUrl;
  return member;
};

const buildProject = (definition) => ({
  title: definition.title,
  path: slugify(definition.title),
  startDate: definition.startDate,
  summary: '',
  blurb: '',
  isFeatured: definition.isFeatured ?? false,
  isCurrentProject: definition.isCurrentProject,
  memberIds: [],
  image: [],
});

const sortObject = (object) =>
  Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));

export const convertRoster = (csvText) => {
  const warnings = [];
  const people = mergeSubmissions(parseCsv(csvText));

  const projects = {};
  for (const definition of [...PROJECTS, ...PAST_PROJECTS]) {
    const project = buildProject(definition);
    projects[project.path] = project;
  }
  const projectIdByTitle = new Map(
    Object.entries(projects).map(([id, project]) => [project.title, id]),
  );

  const members = {};
  for (const record of people) {
    const member = buildMember(record, warnings);
    const id = slugify(`${member.firstName} ${member.lastName}`);
    if (members[id]) throw new Error(`Duplicate member ID after merging: ${id}`);

    for (const role of member.componentRolesArr) {
      const projectId = projectIdByTitle.get(role.team);
      if (!projectId || member.projectIds.includes(projectId)) continue;
      member.projectIds.push(projectId);
      projects[projectId].memberIds.push(id);
    }
    members[id] = member;
  }

  for (const [id, member] of Object.entries(MANUAL_MEMBERS)) {
    if (members[id]) throw new Error(`Manual member ${id} is also in the CSV`);
    members[id] = structuredClone(member);
  }

  const missingBoardRoles = Object.keys(EXTRA_BOARD_ROLES).filter((id) => !members[id]);
  if (missingBoardRoles.length > 0) {
    throw new Error(`Board roles for members not in the CSV: ${missingBoardRoles.join(', ')}`);
  }

  for (const project of Object.values(projects)) project.memberIds.sort();
  const merged = people.filter((record) => record.submissions > 1).length;
  return { members: sortObject(members), projects: sortObject(projects), warnings, merged };
};

const main = async () => {
  const [csvPath = path.join(REPO_ROOT, 'data/h4i_members_f26.csv'), outDir = path.join(REPO_ROOT, 'data')] =
    process.argv.slice(2);
  const { members, projects, warnings, merged } = convertRoster(await readFile(csvPath, 'utf8'));

  await writeFile(path.join(outDir, 'members.json'), `${JSON.stringify(members, null, 2)}\n`);
  await writeFile(path.join(outDir, 'projects.json'), `${JSON.stringify(projects, null, 2)}\n`);

  console.error(
    `${Object.keys(members).length} members (${merged} merged from repeat submissions), ` +
    `${Object.keys(projects).length} projects written to ${outDir}`,
  );
  for (const warning of warnings) console.error(`warning: ${warning}`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
