import type { HomeContent } from './types';

export const defaultHomeContent: HomeContent = {
  hero: {
    heading: 'Hack4Impact UMD',
    body: 'Students building technology with nonprofit partners.',
    slides: [],
    primaryCta: { label: 'Learn about us', href: '/aboutus' },
    secondaryCta: { label: 'Explore our work', href: '/ourwork' },
  },
  nonprofitMap: {
    heading: 'Our nonprofit partners',
    body: 'Explore the organizations our student teams have worked with.',
    statusTitle: 'Partner map',
    statusDescription: 'Partner locations will appear here when verified data is available.',
  },
  testimonials: { heading: 'Partner stories', items: [] },
  newsletter: {
    heading: 'Chapter updates',
    body: 'Follow Hack4Impact UMD for verified project and chapter news.',
    subscribeHeading: 'Stay connected',
    card: { date: '', sender: '', title: '', recapTitle: '', recapBody: '' },
    stats: [],
  },
  sponsors: { heading: 'Our sponsors', tiers: [] },
  cta: {
    heading: 'Make an impact with us',
    primary: { label: 'Apply as a student', href: '/apply/student' },
    secondary: { label: 'Partner as a nonprofit', href: '/apply/nonprofit' },
  },
};
