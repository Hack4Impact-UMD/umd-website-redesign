import { contentResponseSchema } from './contracts';
import { apiGet } from './http';

export type ContentKey =
  | 'home'
  | 'about'
  | 'our-work'
  | 'apply/student'
  | 'apply/nonprofit'
  | 'site-settings';

export const getContentDocument = async (key: ContentKey, signal?: AbortSignal) => {
  const response = await apiGet(`content/${key}`, { schema: contentResponseSchema, signal });
  return response.data;
};
