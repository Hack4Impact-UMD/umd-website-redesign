import { apiGet } from './http';
import {
  AboutContent,
  ApplyNonprofitContent,
  ApplyStudentContent,
  ContentResponse,
  HomeContent,
  OurWorkContent,
  SiteSettings,
} from './types';

const getContentSection = async <T>(path: string): Promise<T | null> => {
  const response = await apiGet<ContentResponse<T>>(path);
  const data = response.data as any;
  if (data && typeof data === 'object' && 'payload' in data && data.payload) {
    return data.payload as T;
  }
  return response.data;
};

export const getHomeContent = () =>
  getContentSection<HomeContent>('/api/content/home');

export const getAboutContent = () =>
  getContentSection<AboutContent>('/api/content/about');

export const getOurWorkContent = () =>
  getContentSection<OurWorkContent>('/api/content/our-work');

export const getApplyStudentContent = () =>
  getContentSection<ApplyStudentContent>('/api/content/apply/student');

export const getApplyNonprofitContent = () =>
  getContentSection<ApplyNonprofitContent>('/api/content/apply/nonprofit');

export const getSiteSettings = () =>
  getContentSection<SiteSettings>('/api/content/site-settings');
