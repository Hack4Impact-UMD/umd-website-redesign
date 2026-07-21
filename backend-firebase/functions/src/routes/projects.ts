import { Request, Response } from 'express';
import { Query } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { db } from '../firebase';
import { MemberRecord, ProjectRecord } from '../models';
import { mapProjectToStrapiEntity, buildCollectionResponse } from '../mappers/strapi';
import { parsePagination, parseProjectFilters } from '../utils/query';
import { safeJson, sendApiError } from '../utils/http';
import { toDateSortKey } from '../utils/date';
import { normalizeRelationIds } from '../utils/relations';
import { RuntimeConfig } from '../config';
import { QueryValidationError } from '../utils/query';

const projectCollection = db.collection('projects');
const memberCollection = db.collection('members');

const buildQuery = (
  request: Request,
): Query => {
  const filters = parseProjectFilters(request);
  let query: Query = projectCollection;

  if (typeof filters.path === 'string' && filters.path.length > 0) {
    query = query.where('path', '==', filters.path);
  }

  if (typeof filters.isFeatured === 'boolean') {
    query = query.where('isFeatured', '==', filters.isFeatured);
  }

  if (typeof filters.isCurrentProject === 'boolean') {
    query = query.where('isCurrentProject', '==', filters.isCurrentProject);
  }

  return query;
};

const sortProjects = (projects: ProjectRecord[]): ProjectRecord[] => {
  return [...projects].sort((a, b) => {
    const aDateKey = toDateSortKey(a.startDate);
    const bDateKey = toDateSortKey(b.startDate);

    if (aDateKey !== null && bDateKey !== null && aDateKey !== bDateKey) {
      return bDateKey - aDateKey;
    }

    if (aDateKey !== null && bDateKey === null) {
      return -1;
    }

    if (aDateKey === null && bDateKey !== null) {
      return 1;
    }

    return a.title.localeCompare(b.title);
  });
};

const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

const toProjectRecord = (id: string, raw: FirebaseFirestore.DocumentData): ProjectRecord => ({
  id,
  title: raw.title ?? '',
  path: raw.path ?? id,
  startDate: raw.startDate,
  summary: raw.summary ?? '',
  blurb: raw.blurb ?? '',
  isFeatured: raw.isFeatured === true,
  isCurrentProject: raw.isCurrentProject === true,
  repoURL: raw.repoURL,
  hostedProjectURL: raw.hostedProjectURL,
  imageAltText: raw.imageAltText,
  image: Array.isArray(raw.image) ? raw.image : [],
  memberIds: normalizeRelationIds(raw.memberIds),
  nonprofitName: raw.nonprofitName,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

const toMemberRecord = (id: string, raw: FirebaseFirestore.DocumentData): MemberRecord => ({
  id,
  firstName: raw.firstName ?? '',
  lastName: raw.lastName ?? '',
  pronouns: raw.pronouns,
  avatar: raw.avatar ?? null,
  componentRolesArr: Array.isArray(raw.componentRolesArr) ? raw.componentRolesArr : [],
  memberDisplayStatus: raw.memberDisplayStatus ?? 'Current Member',
  projectIds: normalizeRelationIds(raw.projectIds),
  linkedinUrl: raw.linkedinUrl,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const getProjects = async (
  request: Request,
  response: Response,
  config: RuntimeConfig,
) => {
  try {
    const { page, pageSize } = parsePagination(request);
    const query = buildQuery(request);

    const [projectsSnapshot, membersSnapshot] = await Promise.all([
      query.get(),
      memberCollection.get(),
    ]);

    const projects = projectsSnapshot.docs.map((doc) => toProjectRecord(doc.id, doc.data()));
    const sortedProjects = sortProjects(projects);
    const total = sortedProjects.length;
    const pagedProjects = paginate(sortedProjects, page, pageSize);

    const members = membersSnapshot.docs.map((doc) => toMemberRecord(doc.id, doc.data()));
    const memberMap = new Map<string, MemberRecord>(members.map((member) => [member.id, member]));

    const entities = pagedProjects.map((project) => mapProjectToStrapiEntity(project, memberMap));
    const payload = buildCollectionResponse(entities, page, pageSize, total);

    logger.info('projects.read', {
      total,
      page,
      pageSize,
      query: request.query,
    });

    safeJson(response, payload, config);
  } catch (error) {
    if (error instanceof QueryValidationError) {
      sendApiError(response, 400, 'query/invalid', error.message);
      return;
    }
    logger.error('projects.read.error', error as Error);
    sendApiError(response, 500, 'projects/read-failed', 'Failed to fetch projects');
  }
};
