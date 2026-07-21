import teamPhoto from '@/components/assets/about/team-showcase.webp';
import valuesPhoto from '@/components/assets/about/values-collaboration.webp';
import type { AboutContent } from './types';

export const defaultAboutContent: AboutContent = {
  header: {
    title: 'About Us',
    paragraphs: [
      'Hack4Impact-UMD is a student-led organization at the University of Maryland and an official chapter of Hack4Impact, a national 501(c)(3) nonprofit using technology for social good. We partner with local and mission-driven nonprofit organizations to design and build free, high-quality software that helps organizations operate more efficiently and scale their impact.',
      'Our cross-functional teams of student designers, software engineers, and product managers collaborate closely with nonprofit partners to deliver custom web and mobile applications tailored to real organizational needs, providing sustainable technology solutions nonprofits may not otherwise have access to.',
    ],
    image: teamPhoto,
    imageAlt: 'Hack4Impact UMD members at a project showcase',
  },
  mission: {
    heading: 'Our Mission',
    body: 'Our mission is to leverage technology for social good by building impactful software solutions for nonprofit organizations while providing students with real-world, professional experience.',
  },
  values: {
    heading: 'Our Values',
    items: [
      {
        title: 'Go Beyond Technology',
        description:
          'Technology is only one tool we use in our greater mission for social impact. We learn from, work with, and are inspired by others tackling social problems using a multitude of tools.',
        image: valuesPhoto,
        imageAlt: 'Hack4Impact UMD members collaborating around a table',
      },
      {
        title: 'Develop with Care',
        description:
          'We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. We work to deeply understand the people we are helping.',
        image: valuesPhoto,
        imageAlt: 'Hack4Impact UMD members collaborating around a table',
      },
      {
        title: 'Be Open Minded',
        description:
          'Our process depends on openness to different people, topics, and perspectives. We embrace difference and work against intolerance to foster an inclusive environment.',
        image: valuesPhoto,
        imageAlt: 'Hack4Impact UMD members collaborating around a table',
      },
    ],
  },
  currentProjects: {
    heading: 'Current Project Teams',
    linkLabel: 'View all projects →',
    linkHref: '/ourwork',
    projectPaths: [],
  },
};
