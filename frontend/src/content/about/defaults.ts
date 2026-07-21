import teamPhoto from '@/components/assets/h4igroup_photo.jpg';
import type { AboutContent } from './types';

export const defaultAboutContent: AboutContent = {
  header: {
    title: 'About Hack4Impact UMD',
    paragraphs: ['We are a student-led organization building technology with nonprofit partners.'],
    image: teamPhoto,
    imageAlt: 'Hack4Impact UMD team',
  },
  mission: {
    heading: 'Our mission',
    body: 'We develop socially impactful software and help students grow through real project work.',
  },
  values: { heading: 'Our values', items: [] },
  currentProjects: {
    heading: 'Current project teams',
    linkLabel: 'View all projects',
    linkHref: '/ourwork',
    projectPaths: [],
  },
};
