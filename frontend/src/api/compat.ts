import { apiGet } from './http';
import {
  MemberDisplayStatus,
  StrapiCollectionResponse,
  StrapiMemberAttributes,
  StrapiProjectAttributes,
} from './types';

const boolFilter = (key: string, value: boolean | undefined) => {
  if (typeof value !== 'boolean') return '';
  return `&${encodeURIComponent(key)}=${value}`;
};

const stringFilter = (key: string, value: string | undefined) => {
  if (!value) return '';
  return `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

export interface GetProjectsOptions {
  isFeatured?: boolean;
  isCurrentProject?: boolean;
  path?: string;
  page?: number;
  pageSize?: number;
}

export const getProjects = async (
  options: GetProjectsOptions = {},
): Promise<StrapiCollectionResponse<StrapiProjectAttributes>> => {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 100;

  const query = [
    `pagination[page]=${page}`,
    `pagination[pageSize]=${pageSize}`,
  ];

  const filters = [
    boolFilter('filters[isFeatured][$eq]', options.isFeatured),
    boolFilter('filters[isCurrentProject][$eq]', options.isCurrentProject),
    stringFilter('filters[path][$eq]', options.path),
  ]
    .filter(Boolean)
    .join('');

  return apiGet<StrapiCollectionResponse<StrapiProjectAttributes>>(
    `/api/projects?${query.join('&')}${filters}`,
  );
};

export interface GetMembersOptions {
  filterStatus?: MemberDisplayStatus;
  page?: number;
  pageSize?: number;
}

export const getMembers = async (
  options: GetMembersOptions = {},
): Promise<StrapiCollectionResponse<StrapiMemberAttributes>> => {
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? 100;

  const query = [
    `pagination[page]=${page}`,
    `pagination[pageSize]=${pageSize}`,
  ];

  const statusFilter = options.filterStatus
    ? `&filters[memberDisplayStatus][$eq]=${encodeURIComponent(options.filterStatus)}`
    : '';

  return apiGet<StrapiCollectionResponse<StrapiMemberAttributes>>(
    `/api/members?${query.join('&')}${statusFilter}`,
  );
};
