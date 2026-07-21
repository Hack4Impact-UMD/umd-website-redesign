import { resolveContentDocument } from '../contracts';
import { defaultSiteSettings } from './defaults';
import { siteSettingsSchema } from './types';

export const normalizeSiteSettings = (document: unknown) =>
  resolveContentDocument(document, siteSettingsSchema, defaultSiteSettings);
