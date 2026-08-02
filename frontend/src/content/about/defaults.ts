import teamPhoto from '@/components/assets/about/team-showcase.webp';
import valuesPhoto from '@/components/assets/about/values-collaboration.webp';
import h4iGroupPhoto from '@/components/assets/h4igroup_photo.jpg';
import aboutHeaderPhoto from '@/components/assets/backgrounds/about_us/aboutus_header2023.png';
import type { AboutContent } from './types';

export const defaultAboutContent = {
  header: {
    title: 'About Us',
    paragraphs: [
      'Hack4Impact-UMD is a student-led organization at the University of Maryland and an official chapter of Hack4Impact, a national 501(c)(3) nonprofit using technology for social good. We partner with local and mission-driven nonprofit organizations to design and build free, high-quality software that helps organizations operate more efficiently and scale their impact.',
      'Our cross-functional teams of student designers, software engineers, and product managers collaborate closely with nonprofit partners to deliver custom web and mobile applications tailored to real organizational needs, providing sustainable technology solutions nonprofits may not otherwise have access to.',
    ],
    image: aboutHeaderPhoto,
    imageAlt: 'Hack4Impact UMD members',
  },
  mission: {
    heading: 'Our Mission',
    body: 'Our mission is to leverage technology for social good by building impactful software solutions for nonprofit organizations while providing students with real-world, professional experience.',
  },
  story: {
    heading: 'Our Story',
    intro:
      'We leverage technology for social good by building impactful software solutions for nonprofit organizations while providing students with real-world, professional experience. See how we’ve grown from vision to impact.',
    items: [
      {
        label: 'Fall 2020',
        title: 'A new chapter at UMD',
        description:
          'Hack4Impact-UMD was founded by Lydia Hu, Simin Li, and Abbie Tran at the University of Maryland, College Park as a student organization focused on technology for social good.',
        links: [
          { label: 'Lydia Hu', href: 'https://www.linkedin.com/in/lydia-hu/' },
          { label: 'Simin Li', href: 'https://www.linkedin.com/in/simin-li-88088b/' },
          { label: 'Abbie Tran', href: 'https://www.linkedin.com/in/abbie-tran-a47893153/' },
        ],
        image: teamPhoto,
        imageAlt: 'Hack4Impact UMD members at a project showcase',
      },
      {
        label: 'On campus',
        title: 'Students learning by doing',
        description:
          'Our members gain real-world, professional experience while exploring ways technology can support their communities.',
      },
      {
        label: 'Across disciplines',
        title: 'A cross-functional community',
        description:
          'Designers, software engineers, and product managers work together to turn a partner’s needs into practical software.',
        image: h4iGroupPhoto,
        imageAlt: 'Hack4Impact UMD members gathered in a classroom',
      },
      {
        label: 'With partners',
        title: 'Built alongside nonprofits',
        description:
          'We collaborate closely with local and mission-driven nonprofit organizations to understand the people and problems behind every project.',
      },
      {
        label: 'Today',
        title: 'Technology with care',
        description:
          'Our teams build custom web and mobile applications that help organizations operate more efficiently and expand their impact.',
        image: valuesPhoto,
        imageAlt: 'Hack4Impact UMD members collaborating around a table',
      },
    ],
  },
  highlights: {
    heading: 'At a Glance',
    items: [
      { value: '2020', label: 'Founded at UMD' },
      { value: 'UMD', label: 'College Park, Maryland' },
      { value: 'Student-led', label: 'A campus community' },
      { value: 'Technology', label: 'For social good' },
      { value: 'Nonprofits', label: 'Mission-driven partners' },
      { value: 'Teams', label: 'Design, product, and engineering' },
    ],
  },
  values: {
    heading: 'Our Values',
    items: [
      {
        title: 'Go Beyond Technology',
        description:
          'Technology is only one tool we use in our greater mission for social impact. We learn from, work with, and are inspired by others tackling social problems using a multitude of tools.',
        image: teamPhoto,
        imageAlt: 'Hack4Impact UMD members at a project showcase',
      },
      {
        title: 'Develop with Care',
        description:
          'We build with others in mind. Empathy and compassion are crucial to serving our partner organizations and members. We work to deeply understand the people we are helping.',
        image: h4iGroupPhoto,
        imageAlt: 'Hack4Impact UMD members gathered in a classroom',
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
} satisfies AboutContent;
