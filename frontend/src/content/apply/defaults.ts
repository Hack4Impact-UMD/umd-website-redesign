import teamPhoto from '@/components/assets/apply/apply-team.jpg';
import classroomPhoto from '@/components/assets/apply/apply-classroom.jpg';
import type { ApplyNonprofitContent, ApplyStudentContent } from './types';

const closedStatus = {
  state: 'closed' as const,
  label: 'Applications are currently closed. Check back for a verified application window.',
};

export const defaultApplyStudentContent: ApplyStudentContent = {
  applicationStatus: closedStatus,
  hero: { title: 'Students', image: teamPhoto },
  intro: {
    heading: 'Build technology for social impact',
    body: 'We prepare students for socially conscious roles in technology while building a supportive community. Members develop real-world experience with agile teams made up of product managers, designers, tech leads, and engineers.',
    ctaLabel: 'Applications closed',
    ctaHref: '/apply/student',
    image: classroomPhoto,
    imageAlt: 'Hack4Impact UMD students gathered in a lecture hall',
  },
  roles: [
    {
      title: 'Engineer',
      icon: 'engineer',
      description: 'Engineers implement product features and complete the technical work planned for each sprint.',
    },
    {
      title: 'Designer',
      icon: 'designer',
      description: 'Designers create the product experience, gather partner feedback, and support engineers as designs are implemented.',
    },
    {
      title: 'Tech Lead',
      icon: 'tech-lead',
      description: 'Tech leads guide technical scope, help plan engineering work, and mentor the engineers on their team.',
    },
    {
      title: 'Sourcing',
      icon: 'sourcing',
      description: 'Sourcing members connect with nonprofit organizations and help shape partnerships for future semesters.',
    },
    {
      title: 'Product Manager',
      icon: 'product-manager',
      description: 'Product managers scope the product, plan sprints, lead team meetings, and communicate with the nonprofit partner.',
    },
    {
      title: 'Bootcamp',
      icon: 'bootcamp',
      description: 'Bootcamp teaches web development foundations to students preparing to join a project team in a future semester.',
    },
  ],
  timeline: {
    heading: 'Application Process & Timeline',
    description: 'We recruit new members in both the fall and spring. Exact dates are published here only after they are confirmed.',
    steps: [
      {
        title: 'Step 1',
        subtitle: 'Written application',
        description: 'The written application asks short questions about your interest in and commitment to Hack4Impact UMD’s mission.',
      },
      {
        title: 'Step 2',
        subtitle: 'Interview, when applicable',
        description: 'Applicants selected for an interview receive scheduling details by email. The conversation is behavioral, not technical.',
      },
      {
        title: 'Step 3',
        subtitle: 'Decision',
        description: 'All applicants receive their decision by email, with onboarding information included for accepted members.',
      },
    ],
  },
  testimonials: [],
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'How much of a time commitment is Hack4Impact UMD?',
        answer: 'Most project team members spend about 3–5 hours per week, including a weekly team meeting and individual project work. Leadership roles may require additional time.',
      },
      {
        question: 'Do I need prior technical experience before applying?',
        answer: 'Not for every role. Applicants with less web development experience may be considered for Bootcamp, and sourcing roles do not require a technical background.',
      },
      {
        question: 'What technology do project teams use?',
        answer: 'Teams commonly use Firebase, Express, React, and Node.js, while adapting to a partner’s existing technology when appropriate.',
      },
    ],
  },
  cta: {
    heading: 'Ready to Work with Us?',
    primaryLabel: 'Apply',
    primaryHref: '/apply/student',
    secondaryLabel: 'View projects',
    secondaryHref: '/ourwork',
  },
};

export const defaultApplyNonprofitContent: ApplyNonprofitContent = {
  applicationStatus: closedStatus,
  hero: { title: 'Nonprofits', image: teamPhoto },
  banner: { enabled: false, text: '' },
  intro: {
    heading: 'Build with Hack4Impact UMD',
    body: 'Our student teams collaborate with nonprofit organizations on semester-long technology projects. We work with each partner to scope and develop a product that supports its mission and day-to-day needs.',
    ctaLabel: 'Applications closed',
    ctaHref: '/apply/nonprofit',
    image: classroomPhoto,
    imageAlt: 'Hack4Impact UMD students gathered in a lecture hall',
  },
  criteria: { heading: 'Partnership criteria', paragraphs: [] },
  timeline: {
    heading: 'Application Process & Timeline',
    description: 'Exact application dates are published here only after they are confirmed.',
    steps: [
      {
        title: 'Step 1',
        subtitle: 'Application review',
        description: 'After an application is submitted, our sourcing team reviews the organization’s goals and technology needs.',
      },
      {
        title: 'Step 2',
        subtitle: 'Introductory meeting',
        description: 'Selected organizations meet virtually with our team to discuss the collaboration timeline, their work, and potential project ideas.',
      },
      {
        title: 'Step 3',
        subtitle: 'Project decision',
        description: 'After the meeting, we follow up about whether we can collaborate on the proposed project and outline any next steps.',
      },
    ],
  },
  testimonials: [],
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What types of projects do you undertake?',
        answer: 'Most projects are web applications, including volunteer tools, member directories, and data-tracking systems. Our project library shows examples of previous work.',
      },
      {
        question: 'How much does a project cost?',
        answer: 'Our development work is free. Partners may be responsible for low ongoing website or hosting expenses, which we work to keep minimal.',
      },
      {
        question: 'What does the project timeline look like?',
        answer: 'Development usually follows an academic semester, with regular partner communication throughout the project.',
      },
      {
        question: 'How involved should a nonprofit partner be?',
        answer: 'Partners should provide a consistent point of contact and regular feedback so the team can build the right product.',
      },
      {
        question: 'How does long-term maintenance work?',
        answer: 'Teams provide a handoff at the end of the semester. We try to address later bugs when possible, but ongoing feature work cannot be guaranteed after the engagement ends.',
      },
    ],
  },
  cta: {
    heading: 'Ready to Work with Us?',
    primaryLabel: 'Apply',
    primaryHref: '/apply/nonprofit',
    secondaryLabel: "I'm a Student",
    secondaryHref: '/apply/student',
  },
};
