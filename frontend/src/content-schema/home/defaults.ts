import campStarfishLogo from '@/components/assets/home/camp-starfish.png?url';
import classroomPhoto from '@/components/assets/apply/apply-classroom.webp?url';
import ACES from '@/components/assets/supporters/ACES.png?url';
import Bloomberg from '@/components/assets/supporters/Bloomberg.png?url';
import CapitalOne from '@/components/assets/supporters/CapitalOne.png?url';
import CodePath from '@/components/assets/supporters/CodePath.png?url';
import DoGood from '@/components/assets/supporters/DoGood.png?url';
import Microsoft from '@/components/assets/supporters/Microsoft.png?url';
import SmithSchool from '@/components/assets/supporters/SmithSchool.png?url';
import Uber from '@/components/assets/supporters/Uber.png?url';
import type { HomeContent } from './types';

export const defaultHomeContent: HomeContent = {
  hero: {
    heading: 'Building software for social good',
    body: 'Each semester, Hack4Impact-UMD student teams work alongside nonprofit partners to design, build, and hand off the high-quality software they need.',
    slides: [
      {
        image: classroomPhoto,
        mobileImage: classroomPhoto,
        alt: 'Hack4Impact UMD students collaborating at a laptop workshop',
      },
    ],
    primaryCta: { label: 'Join as a student', href: '/apply/student' },
    secondaryCta: { label: 'Partner with us', href: '/apply/nonprofit' },
  },
  impact: {
    mode: 'published',
    heading: 'Our impact',
    placeholderMessage: 'Impact metrics are being updated.',
    stats: [
      // The first stat is shown as the section's lead number.
      { value: '$150K', label: 'Value delivered to nonprofits', verified: true },
      { value: '10+', label: 'Software projects delivered', verified: true },
      { value: '12', label: 'Nonprofit partners served', verified: true },
      { value: '150+', label: 'Active members', verified: true },
      { value: '400+', label: 'Applicants per semester', verified: true },
    ],
  },
  nonprofitMap: {
    mode: 'placeholder',
    heading: 'Where our partners are',
    body: 'Our student teams have built software for nonprofits across Maryland and beyond.',
    statusTitle: 'Our nonprofit partners',
    statusDescription: 'View the project library for the complete, current list of nonprofit collaborations.',
    featuredProject: {
      title: 'Camp Starfish',
      summary: 'A photo web application that lets families and staff securely access and organize more than 1,000 summer photos.',
      href: '/ourwork/camp-starfish',
      logo: campStarfishLogo,
      logoAlt: 'Camp Starfish logo',
    },
  },
  testimonials: {
    // Hidden until real partner quotes are collected.
    mode: 'hidden',
    heading: 'Testimonials from Our Nonprofit Partners',
    placeholderMessage: 'We’re gathering stories from our nonprofit partners. Check back soon to hear about their experiences working with our teams.',
    items: [],
  },
  newsletter: {
    // Hidden until there is a public newsletter archive to link to.
    mode: 'hidden',
    heading: 'Check Out Our Recent Newsletter',
    body: 'Catch up on recent projects, events, and chapter highlights from Hack4Impact UMD.',
    subscribeHeading: 'Newsletter updates',
    placeholderMessage: 'We’re preparing a public archive of chapter updates. In the meantime, follow our social channels for the latest news.',
    stats: [],
  },
  sponsors: {
    mode: 'published',
    heading: 'Our sponsors',
    placeholderMessage: 'Sponsor information is being updated.',
    tiers: [
      {
        name: 'Platinum',
        sponsors: [
          { name: 'Microsoft', logo: Microsoft, visible: true },
          { name: 'Uber', logo: Uber, visible: true },
        ],
      },
      {
        name: 'Gold',
        sponsors: [
          { name: 'CodePath', logo: CodePath, visible: true },
          { name: 'Do Good Institute', logo: DoGood, visible: true },
          { name: 'Capital One', logo: CapitalOne, visible: true },
          { name: 'Robert H. Smith School of Business', logo: SmithSchool, visible: true },
        ],
      },
      {
        name: 'Silver',
        sponsors: [{ name: 'Bloomberg', logo: Bloomberg, visible: true }],
      },
      {
        name: 'Bronze',
        sponsors: [{ name: 'ACES', logo: ACES, visible: true }],
      },
    ],
    contactCta: {
      label: 'Become a sponsor',
      href: '/contactus',
    },
  },
  cta: {
    heading: 'Build with us this semester',
    primary: { label: 'Join as a student', href: '/apply/student' },
    secondary: { label: 'Partner with us', href: '/apply/nonprofit' },
  },
};
