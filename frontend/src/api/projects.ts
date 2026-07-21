import { projectsResponseSchema, type ProjectEntity, type ProjectsResponse } from './contracts';
import { ApiError } from './errors';
import { apiGet } from './http';
import { MAX_PAGE_COUNT, projectQuery, type ProjectFilter } from './query';

interface ProjectRequestOptions {
  filter?: ProjectFilter;
  pageSize?: number;
  signal?: AbortSignal;
}

export const getProjectsPage = (page: number, options: ProjectRequestOptions = {}) => {
  const query = projectQuery(page, options.pageSize ?? 100, options.filter);
  return apiGet(`projects?${query}`, { schema: projectsResponseSchema, signal: options.signal });
};

export const getProjects = async (options: ProjectRequestOptions = {}): Promise<ProjectEntity[]> => {
  const records: ProjectEntity[] = [];
  let page = 1;
  let pageCount = 1;

  do {
    if (options.signal?.aborted) {
      throw new ApiError({ kind: 'aborted', message: 'Request was cancelled.' });
    }
    const response: ProjectsResponse = await getProjectsPage(page, options);
    if (response.meta.pagination.page !== page || response.meta.pagination.pageCount < page) {
      throw new ApiError({ kind: 'contract', message: 'The API returned inconsistent project pagination.' });
    }
    records.push(...response.data);
    pageCount = response.meta.pagination.pageCount;
    if (pageCount > MAX_PAGE_COUNT) {
      throw new ApiError({ kind: 'contract', message: 'The API reported too many result pages.' });
    }
    page += 1;
  } while (page <= pageCount);

  if (records.length > 0 && new Set(records.map(({ id }) => id)).size !== records.length) {
    throw new ApiError({ kind: 'contract', message: 'The API returned duplicate project IDs.' });
  }

  return records;
};
