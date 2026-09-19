import { contentResponseSchema } from './contracts';
import { apiGet, type ApiRequestOptions } from './http';

export type ContentKey =
  | 'home'
  | 'about'
  | 'our-work'
  | 'apply/student'
  | 'apply/nonprofit'
  | 'site-settings';

export const getContentDocument = async (key: ContentKey, options: ApiRequestOptions = {}) => {
  const response = await apiGet(`content/${key}`, {
    schema: contentResponseSchema,
    ...options,
  });
  return response.data;
};
