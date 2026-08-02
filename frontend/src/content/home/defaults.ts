import groupPhoto from '@/components/assets/h4igroup_photo.jpg';
import campStarfishLogo from '@/components/assets/home/camp-starfish.png';
import mobileGroupPhoto from '@/components/assets/home/h4igroup-photo-mobile.webp';
import classroomPhoto from '@/components/assets/apply/apply-classroom.jpg';
import ACES from '@/components/assets/supporters/ACES.png';
import Bloomberg from '@/components/assets/supporters/Bloomberg.png';
import CapitalOne from '@/components/assets/supporters/CapitalOne.png';
import CodePath from '@/components/assets/supporters/CodePath.png';
import DoGood from '@/components/assets/supporters/DoGood.png';
import Microsoft from '@/components/assets/supporters/Microsoft.png';
import SmithSchool from '@/components/assets/supporters/SmithSchool.png';
import Uber from '@/components/assets/supporters/Uber.png';
import type { HomeContent } from './types';

export const defaultHomeContent: HomeContent = {
  hero: {
    heading: 'Hack4Impact-UMD',
    body: 'Building powerful nonprofit software as a tool for social good. We connect UMD students with nonprofits to create technology that supports their work.',
    slides: [
      {
        image: classroomPhoto,
        mobileImage: mobileGroupPhoto,
        alt: 'Hack4Impact UMD students collaborating at a laptop workshop',
      },
    ],
    primaryCta: { label: 'Learn More', href: '/aboutus' },
    secondaryCta: { label: 'Apply Now', href: '/apply/student' },
  },
  impact: {
    mode: 'published',
    heading: 'Our Impact',
    placeholderMessage: 'Impact metrics are being updated.',
    stats: [
      { value: '10+', label: 'Software projects delivered', verified: true },
      { value: '12', label: 'Nonprofit partners served', verified: true },
      { value: '150+', label: 'Active members', verified: true },
      { value: '400+', label: 'Applicants per semester', verified: true },
      { value: '$150K', label: 'Value delivered to nonprofits', verified: true },
    ],
  },
  nonprofitMap: {
    mode: 'placeholder',
    heading: 'Explore Our Nonprofit Partners',
    body: 'Explore the nonprofit partners our student teams support in Maryland and beyond.',
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
    mode: 'placeholder',
    heading: 'Testimonials from Our Nonprofit Partners',
    placeholderMessage: 'We’re gathering stories from our nonprofit partners. Check back soon to hear about their experiences working with our teams.',
    items: [],
  },
  newsletter: {
    mode: 'placeholder',
    heading: 'Check Out Our Recent Newsletter',
    body: 'Catch up on recent projects, events, and chapter highlights from Hack4Impact UMD.',
    subscribeHeading: 'Newsletter updates',
    placeholderMessage: 'We’re preparing a public archive of chapter updates. In the meantime, follow our social channels for the latest news.',
    stats: [],
  },
  sponsors: {
    mode: 'published',
    heading: 'Our Sponsors',
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
      label: 'Interested in sponsoring or partnering? Contact us',
      href: '/contactus',
    },
  },
  cta: {
    heading: 'Come Make an Impact With Us!',
    primary: { label: 'Partner as a Nonprofit', href: '/apply/nonprofit' },
    secondary: { label: 'Join as a Student', href: '/apply/student' },
  },
};
