import { Request, Response } from 'express';
import { Query } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions';
import { db } from '../firebase';
import { MemberRecord } from '../models';
import { buildCollectionResponse, mapMemberToStrapiEntity } from '../mappers/strapi';
import { parseMemberFilters, parsePagination } from '../utils/query';
import { safeJson, sendApiError } from '../utils/http';
import { normalizeRelationIds } from '../utils/relations';
import { RuntimeConfig } from '../config';
import { QueryValidationError } from '../utils/query';

const memberCollection = db.collection('members');

const buildQuery = (request: Request): Query => {
  const { memberDisplayStatus } = parseMemberFilters(request);
  let query: Query = memberCollection;

  if (typeof memberDisplayStatus === 'string' && memberDisplayStatus.length > 0) {
    query = query.where('memberDisplayStatus', '==', memberDisplayStatus);
  }

  return query;
};

const sortMembers = (members: MemberRecord[]): MemberRecord[] => {
  return [...members].sort((a, b) => {
    const aName = `${a.firstName} ${a.lastName}`.trim();
    const bName = `${b.firstName} ${b.lastName}`.trim();
    return aName.localeCompare(bName);
  });
};

const paginate = <T>(items: T[], page: number, pageSize: number) => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

const toMemberRecord = (id: string, raw: FirebaseFirestore.DocumentData): MemberRecord => ({
  id,
  firstName: raw.firstName ?? '',
  lastName: raw.lastName ?? '',
  pronouns: raw.pronouns,
  avatar: raw.avatar ?? null,
  componentRolesArr: Array.isArray(raw.componentRolesArr) ? raw.componentRolesArr : [],
  memberDisplayStatus: raw.memberDisplayStatus ?? 'Current Member',
  projectIds: normalizeRelationIds(raw.projectIds),
  linkedinUrl: typeof raw.linkedinUrl === 'string' ? raw.linkedinUrl : undefined,
  createdAt: raw.createdAt,
  updatedAt: raw.updatedAt,
});

export const getMembers = async (
  request: Request,
  response: Response,
  config: RuntimeConfig,
) => {
  try {
    const { page, pageSize } = parsePagination(request);
    const query = buildQuery(request);
    const snapshot = await query.get();

    const members = snapshot.docs.map((doc) => toMemberRecord(doc.id, doc.data()));
    const sortedMembers = sortMembers(members);
    const total = sortedMembers.length;
    const pagedMembers = paginate(sortedMembers, page, pageSize);

    const entities = pagedMembers.map(mapMemberToStrapiEntity);
    const payload = buildCollectionResponse(entities, page, pageSize, total);

    logger.info('members.read', {
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
    logger.error('members.read.error', error as Error);
    sendApiError(response, 500, 'members/read-failed', 'Failed to fetch members');
  }
};
