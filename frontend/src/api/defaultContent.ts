import {
  AboutContent,
  ApplyNonprofitContent,
  ApplyStudentContent,
  HomeContent,
  OurWorkContent,
  SiteSettings,
} from './types';

export const defaultHomeContent: HomeContent = {
  hero: {
    heading: 'Hack4Impact-UMD',
    body: 'Building nonprofit software for social good with student teams.',
    slides: [
      { image: '/assets/h4igroup_photo.jpg', alt: 'Hack4Impact UMD team photo' },
      { image: '/assets/aboutus_header.png', alt: 'Hack4Impact UMD event' },
    ],
    primaryCta: { label: 'Learn More', href: '/aboutus' },
    secondaryCta: { label: 'Apply Now', href: '/apply/student' },
  },
  nonprofitMap: {
    heading: 'Explore Our Nonprofit Partners',
    body: 'We partner with local and national nonprofits.',
    statusTitle: 'Interactive Map Coming Soon',
    statusDescription: 'Explore partners across Maryland and beyond.',
  },
  testimonials: {
    heading: 'Testimonials from Our Nonprofit Partners',
    items: [
      {
        quote: 'Working with Hack4Impact has been great and mission driven.',
        name: 'Nonprofit Partner',
        organization: 'Organization Name',
      },
      {
        quote: 'The student team was thoughtful and effective.',
        name: 'Nonprofit Partner',
        organization: 'Organization Name',
      },
      {
        quote: 'The delivered product helped our operations.',
        name: 'Nonprofit Partner',
        organization: 'Organization Name',
      },
    ],
  },
  newsletter: {
    heading: 'Check Out Our Recent Newsletter',
    body: 'Stay updated with projects, events, and chapter impact.',
    subscribeHeading: 'Subscribe For Updates',
    subscribeSuccessMessage: 'Thanks for subscribing.',
    card: {
      date: 'January 5, 2025',
      sender: 'Hack4Impact-UMD',
      title: 'Fall Semester Recap Newsletter',
      recapTitle: 'End of Semester Recap',
      recapBody: 'Summary of highlights from the recent semester.',
    },
    stats: [
      { value: '149', label: 'active members' },
      { value: '7', label: 'nonprofits supported' },
      { value: '6', label: 'semesters running' },
      { value: '15', label: 'team-building events' },
      { value: '160', label: 'showcase attendees' },
      { value: '200+', label: 'applicants' },
    ],
  },
  sponsors: {
    heading: 'Our sponsors',
    tiers: [
      {
        name: 'Platinum',
        sponsors: [
          { name: 'Microsoft', logo: '/assets/supporters/Microsoft.png' },
          { name: 'Uber', logo: '/assets/supporters/Uber.png' },
        ],
      },
      {
        name: 'Gold',
        sponsors: [
          { name: 'CodePath', logo: '/assets/supporters/CodePath.png' },
          { name: 'DoGood', logo: '/assets/supporters/DoGood.png' },
          { name: 'Capital One', logo: '/assets/supporters/CapitalOne.png' },
          { name: 'Smith School', logo: '/assets/supporters/SmithSchool.png' },
        ],
      },
      {
        name: 'Silver',
        sponsors: [{ name: 'Bloomberg', logo: '/assets/supporters/Bloomberg.png' }],
      },
      {
        name: 'Bronze',
        sponsors: [{ name: 'ACES', logo: '/assets/supporters/ACES.png' }],
      },
    ],
  },
  cta: {
    heading: 'Come Make an Impact With Us!',
    primary: { label: 'Join as Student', href: '/apply/student' },
    secondary: { label: 'Partner With Us', href: '/apply/nonprofit' },
  },
};

export const defaultAboutContent: AboutContent = {
  header: {
    title: 'About Us',
    paragraphs: [
      'Hack4Impact-UMD is a student-led organization at the University of Maryland.',
      'Our teams build software with nonprofit partners to improve impact.',
    ],
    image: '/assets/h4igroup_photo.jpg',
    imageAlt: 'Hack4Impact UMD team members',
  },
  mission: {
    heading: 'Our Mission',
    body: 'Leverage technology for social good while students gain real project experience.',
  },
  values: {
    heading: 'Our Values',
    items: [
      {
        title: 'Go Beyond Technology',
        description: 'Technology is one tool in a broader mission for social impact.',
        image: '/assets/h4igroup_photo.jpg',
        imageAlt: 'Go Beyond Technology',
      },
      {
        title: 'Develop with Care',
        description: 'We build with empathy and care for partner organizations and members.',
        image: '/assets/h4igroup_photo.jpg',
        imageAlt: 'Develop with Care',
      },
      {
        title: 'Be Open Minded',
        description: 'We welcome different people, ideas, and perspectives.',
        image: '/assets/h4igroup_photo.jpg',
        imageAlt: 'Be Open Minded',
      },
    ],
  },
  currentProjects: {
    heading: 'Current Project Teams',
    linkLabel: 'View all projects ->',
    linkHref: '/ourwork',
  },
};

export const defaultOurWorkContent: OurWorkContent = {
  header: {
    title: 'Past Project Library',
    subtitle: 'Building Software for Social Good',
    image: '/assets/h4igroup_photo.jpg',
    imageAlt: 'Hack4Impact UMD team',
  },
};

export const defaultApplyStudentContent: ApplyStudentContent = {
  hero: { title: 'Apply as a Student', image: '/assets/h4igroup_photo.jpg' },
  intro: {
    heading: 'Join Our Student Community',
    body: 'Collaborate with nonprofits on semester-long software projects.',
    ctaLabel: 'Apply',
    ctaHref: 'https://apply.umd.hack4impact.org/login',
    image: '/assets/mott_haven_image.jpg',
    imageAlt: 'Students collaborating',
  },
  roles: [
    { title: 'Engineer', description: 'Build and ship product features.', icon: 'Code2' },
    { title: 'Designer', description: 'Design UX and visual systems.', icon: 'Brush' },
    { title: 'Tech Lead', description: 'Guide architecture and mentorship.', icon: 'Wrench' },
    { title: 'Sourcing', description: 'Build nonprofit partnerships.', icon: 'Search' },
    { title: 'Product Manager', description: 'Manage roadmap and delivery.', icon: 'ClipboardList' },
    { title: 'Bootcamp', description: 'Learn fundamentals and prepare for teams.', icon: 'GraduationCap' },
  ],
  timeline: {
    heading: 'Application Process & Timeline',
    steps: [
      { title: 'Step 1', subtitle: 'Dates', description: 'Submit the application.' },
      { title: 'Step 2', subtitle: 'Dates', description: 'Interview with a board member.' },
      { title: 'Step 3', subtitle: 'Dates', description: 'Receive decision and onboarding details.' },
    ],
  },
  testimonials: [
    {
      quote: 'Hack4Impact helped me grow while working on a mission-driven product.',
      name: 'Student Member',
      organization: 'Hack4Impact-UMD',
    },
    {
      quote: 'I enjoyed cross-functional collaboration with the team.',
      name: 'Student Lead',
      organization: 'Hack4Impact-UMD',
    },
  ],
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      { question: 'What is the weekly time commitment?', answer: 'Most members spend 3-5 hours per week.' },
      { question: 'Do I need prior technical experience?', answer: 'No. All skill levels are welcome.' },
      { question: 'Which tech stack do teams use?', answer: 'Commonly React, Node.js, and cloud services.' },
      { question: 'Can I apply for multiple roles?', answer: 'Yes. Share interests in the application.' },
    ],
  },
  cta: {
    heading: 'Ready to Work with Us?',
    primaryLabel: 'Apply',
    primaryHref: 'https://apply.umd.hack4impact.org/login',
    secondaryLabel: 'View Projects',
    secondaryHref: '/ourwork',
  },
};

export const defaultApplyNonprofitContent: ApplyNonprofitContent = {
  hero: { title: 'Apply as a Nonprofit', image: '/assets/h4igroup_photo.jpg' },
  banner: { enabled: true, text: 'Currently taking Fall 2025 Applications. Apply Now' },
  intro: {
    heading: 'Partner With Us',
    body: 'Partner with student teams to build software that supports your mission.',
    ctaLabel: 'Apply',
    ctaHref: 'https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link',
    image: '/assets/mott_haven_image.jpg',
    imageAlt: 'Students collaborating',
  },
  criteria: {
    heading: 'Criteria/Qualifications',
    paragraphs: [
      'We prioritize mission alignment, clear problem scope, and active collaboration.',
      'Most projects run for one semester with regular stakeholder feedback.',
    ],
  },
  timeline: {
    heading: 'Application Process & Timeline',
    steps: [
      { title: 'Step 1', subtitle: 'Jan 15 - Feb 1', description: 'Submit your application.' },
      { title: 'Step 2', subtitle: 'Feb 2 - Feb 15', description: 'Meet to discuss collaboration fit.' },
      { title: 'Step 3', subtitle: 'Late Feb - Early Mar', description: 'Confirm scope and next steps.' },
    ],
  },
  testimonials: [
    {
      quote: 'Working with Hack4Impact was organized and impact driven.',
      name: 'Nonprofit Partner',
      organization: 'Organization Name',
    },
    {
      quote: 'The final product delivered strong operational value.',
      name: 'Nonprofit Partner',
      organization: 'Organization Name',
    },
  ],
  faq: {
    heading: 'Frequently Asked Questions',
    items: [
      {
        question: 'What kinds of projects are a good fit?',
        answer: 'Web apps, data tools, and internal systems for nonprofit workflows.',
      },
      {
        question: 'What does a collaboration cost?',
        answer: 'Projects are free aside from minimal hosting costs.',
      },
      {
        question: 'How long does a project take?',
        answer: 'Most engagements span one academic semester.',
      },
      {
        question: 'How involved should my team be?',
        answer: 'Provide regular feedback and a primary point of contact.',
      },
    ],
  },
  cta: {
    heading: 'Ready to Work with Us?',
    primaryLabel: 'Apply',
    primaryHref: 'https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link',
    secondaryLabel: "I'm a Student",
    secondaryHref: '/apply/student',
  },
};

export const defaultSiteSettings: SiteSettings = {
  navbar: {
    links: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Work', href: '/ourwork' },
      {
        label: 'Apply',
        href: '/apply/student',
        dropdown: [
          { label: 'For Students', href: '/apply/student' },
          { label: 'For Nonprofits', href: '/apply/nonprofit' },
        ],
      },
    ],
  },
  footer: {
    newsletterPrompt: 'Subscribe to our newsletter to receive monthly updates.',
    exploreLinks: [
      { label: 'About Us', href: '/aboutus' },
      { label: 'Our Work', href: '/ourwork' },
    ],
    applyLinks: [
      { label: 'For Students', href: '/apply/student' },
      { label: 'For Nonprofits', href: '/apply/nonprofit' },
    ],
    socialLinks: [
      { label: 'Instagram', href: 'https://instagram.com/hack4impactumd', icon: 'Instagram' },
      { label: 'GitHub', href: 'https://github.com/Hack4Impact-UMD', icon: 'Github' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/hack4impact-umd', icon: 'Linkedin' },
      { label: 'Facebook', href: 'https://facebook.com/hack4impactumd', icon: 'Facebook' },
    ],
    contact: {
      addressLines: ['7809 Regents Drive,', 'College Park, MD 20742'],
      email: 'umd@hack4impact.org',
    },
  },
  branding: {
    logo: '/assets/h4i_files/h4i_logo.svg',
  },
};
