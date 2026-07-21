import teamPhoto from '@/components/assets/h4igroup_photo.jpg';
import projectPhoto from '@/components/assets/mott_haven_image.jpg';
import type { ApplyNonprofitContent, ApplyStudentContent } from './types';

const closedStatus = {
  state: 'closed' as const,
  label: 'Applications are currently closed. Check back for a verified application window.',
};

export const defaultApplyStudentContent: ApplyStudentContent = {
  applicationStatus: closedStatus,
  hero: { title: 'Apply as a student', image: teamPhoto },
  intro: {
    heading: 'Join our student community',
    body: 'Work with a multidisciplinary student team on technology for a nonprofit partner.',
    ctaLabel: 'Applications closed',
    ctaHref: '/apply/student',
    image: projectPhoto,
    imageAlt: 'Hack4Impact UMD students collaborating',
  },
  roles: [],
  timeline: { heading: 'Application process', steps: [] },
  testimonials: [],
  faq: { heading: 'Frequently asked questions', items: [] },
  cta: {
    heading: 'Learn more about our work',
    primaryLabel: 'View projects',
    primaryHref: '/ourwork',
    secondaryLabel: 'About us',
    secondaryHref: '/aboutus',
  },
};

export const defaultApplyNonprofitContent: ApplyNonprofitContent = {
  applicationStatus: closedStatus,
  hero: { title: 'Partner as a nonprofit', image: teamPhoto },
  banner: { enabled: false, text: '' },
  intro: {
    heading: 'Build with Hack4Impact UMD',
    body: 'Our student teams collaborate with nonprofit partners on scoped technology projects.',
    ctaLabel: 'Applications closed',
    ctaHref: '/apply/nonprofit',
    image: projectPhoto,
    imageAlt: 'Hack4Impact UMD project team',
  },
  criteria: { heading: 'Partnership criteria', paragraphs: [] },
  timeline: { heading: 'Application process', steps: [] },
  testimonials: [],
  faq: { heading: 'Frequently asked questions', items: [] },
  cta: {
    heading: 'Explore our previous partnerships',
    primaryLabel: 'View projects',
    primaryHref: '/ourwork',
    secondaryLabel: 'About us',
    secondaryHref: '/aboutus',
  },
};
