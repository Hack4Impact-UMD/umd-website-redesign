import {
  membersResponseSchema,
  type MemberDisplayStatus,
  type MemberEntity,
  type MembersResponse,
} from './contracts';
import { ApiError } from './errors';
import { apiGet } from './http';
import { MAX_PAGE_COUNT, memberQuery } from './query';

interface MemberRequestOptions {
  filterStatus?: MemberDisplayStatus;
  pageSize?: number;
  signal?: AbortSignal;
}

export const getMembersPage = (page: number, options: MemberRequestOptions = {}) => {
  const query = memberQuery(page, options.pageSize ?? 200, options.filterStatus);
  return apiGet(`members?${query}`, { schema: membersResponseSchema, signal: options.signal });
};

export const getMembers = async (options: MemberRequestOptions = {}): Promise<MemberEntity[]> => {
  const records: MemberEntity[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    if (options.signal?.aborted) {
      throw new ApiError({ kind: 'aborted', message: 'Request was cancelled.' });
    }
    const response: MembersResponse = await getMembersPage(page, options);
    if (response.meta.pagination.page !== page || response.meta.pagination.pageCount < page) {
      throw new ApiError({ kind: 'contract', message: 'The API returned inconsistent member pagination.' });
    }
    records.push(...response.data);
    pageCount = response.meta.pagination.pageCount;
    if (pageCount > MAX_PAGE_COUNT) {
      throw new ApiError({ kind: 'contract', message: 'The API reported too many result pages.' });
    }
    page += 1;
  } while (page <= pageCount);

  if (records.length > 0 && new Set(records.map(({ id }) => id)).size !== records.length) {
    throw new ApiError({ kind: 'contract', message: 'The API returned duplicate member IDs.' });
  }

  return records;
};
