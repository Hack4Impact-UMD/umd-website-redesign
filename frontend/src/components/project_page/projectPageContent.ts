import defaultFeatureImage from '@/components/assets/h4igroup_photo.jpg';
import featureOneImage from '@/components/assets/mott_haven_image.jpg';
import featureTwoImage from '@/components/assets/yknot_image.jpg';
import defaultSolutionImage from '@/components/assets/projectBG.png';
import defaultTeamPhoto from '@/components/assets/h4igroup_photo.jpg';

export type TechIconKey = 'code' | 'database' | 'layers' | 'shield' | 'rocket';

export interface ProjectPageFeature {
  title: string;
  paragraphs: string[];
  highlights: string[];
  imageSrc: string;
  imageAlt: string;
}

export interface ProjectPageMetric {
  value: string;
  label: string;
}

export interface ProjectPageTestimonial {
  quote: string;
  name: string;
  role: string;
}

export interface ProjectPageStaticContent {
  heroSubtitle: string;
  partnerName: string;
  aboutHeading: string;
  aboutParagraphs: string[];
  problemHeading: string;
  problemCards: Array<{
    title: string;
    body: string;
  }>;
  solutionHeading: string;
  solutionSubheading: string;
  solutionCards: Array<{
    title: string;
    description: string;
  }>;
  solutionScreenshotSrc: string;
  solutionScreenshotAlt: string;
  featuresHeading: string;
  features: ProjectPageFeature[];
  impactHeading: string;
  metrics: ProjectPageMetric[];
  testimonials: ProjectPageTestimonial[];
  techHeading: string;
  techStack: Array<{
    label: string;
    iconKey: TechIconKey;
  }>;
  teamHeading: string;
  teamPhotoSrc?: string;
  teamPhotoAlt?: string;
  relatedWorkHeading: string;
  ctaHeading: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
}

// TODO: Replace static section content with CMS fields when backend project schema is expanded.
export const DEFAULT_STATIC_CONTENT: ProjectPageStaticContent = {
  heroSubtitle:
    'One clear sentence that describes what this solution delivers for the nonprofit and the communities they serve.',
  partnerName: 'Nonprofit Partner',
  aboutHeading: 'About This Partnership',
  aboutParagraphs: [
    'This project supports a mission-driven organization with software tailored to real operational needs.',
    'Our student team worked closely with stakeholders to ship a practical, sustainable product.',
  ],
  problemHeading: 'The Problem',
  problemCards: [
    {
      title: 'Scattered Workflows',
      body: 'Critical data and process steps lived across multiple tools, making collaboration slow and error-prone.',
    },
    {
      title: 'Manual Coordination',
      body: 'Staff relied on repetitive coordination tasks that consumed time better spent on community impact.',
    },
    {
      title: 'Limited Visibility',
      body: 'Teams lacked a reliable source of truth to quickly understand status, ownership, and next actions.',
    },
  ],
  solutionHeading: 'The Solution',
  solutionSubheading:
    'A central platform designed to make day-to-day operations faster, more reliable, and easier to scale.',
  solutionCards: [
    {
      title: 'Centralized Operations',
      description: 'Unified records and workflows into one consistent workspace.',
    },
    {
      title: 'Secure Family Portal',
      description: 'Improved stakeholder communication with role-based, privacy-aware access.',
    },
    {
      title: 'Easy Sharing',
      description: 'Enabled teams to collaborate and hand off work with cleaner data and fewer blockers.',
    },
  ],
  solutionScreenshotSrc: defaultSolutionImage,
  solutionScreenshotAlt: 'Project dashboard screenshot',
  featuresHeading: 'Key Features',
  features: [
    {
      title: 'Feature #1',
      paragraphs: [
        'A high-impact module built for everyday team operations and quick onboarding.',
        'Designed to reduce repetitive administrative tasks while improving consistency.',
      ],
      highlights: [
        'Track and manage key records in one place',
        'Improve visibility across staff workflows',
        'Reduce avoidable mistakes with clearer controls',
      ],
      imageSrc: featureOneImage,
      imageAlt: 'Feature interface screenshot one',
    },
    {
      title: 'Feature #2',
      paragraphs: [
        'A second workflow focused on communication and action tracking for distributed teams.',
        'Built with flexible structure so partner staff can adapt it to evolving needs.',
      ],
      highlights: [
        'Surface real-time updates for all team members',
        'Support secure collaboration between stakeholders',
        'Generate cleaner outputs for recurring workflows',
      ],
      imageSrc: featureTwoImage,
      imageAlt: 'Feature interface screenshot two',
    },
  ],
  impactHeading: 'Impact & Results',
  metrics: [
    { value: '5,000+', label: 'Records migrated' },
    { value: '150+', label: 'Hours reclaimed' },
    { value: '90%', label: 'Team satisfaction' },
  ],
  testimonials: [
    {
      quote:
        'Working with Hack4Impact helped us modernize a critical process and gave our team back time every week.',
      name: 'Nonprofit Partner',
      role: 'Program Director',
    },
    {
      quote:
        'The student team was thoughtful, reliable, and deeply invested in building something our staff can maintain.',
      name: 'Nonprofit Partner',
      role: 'Operations Lead',
    },
  ],
  techHeading: 'How We Built It',
  techStack: [
    { label: 'React', iconKey: 'code' },
    { label: 'Node.js', iconKey: 'layers' },
    { label: 'PostgreSQL', iconKey: 'database' },
    { label: 'Auth', iconKey: 'shield' },
    { label: 'Cloud', iconKey: 'rocket' },
  ],
  teamHeading: 'Meet the Team',
  teamPhotoSrc: defaultTeamPhoto,
  teamPhotoAlt: 'Hack4Impact student project team',
  relatedWorkHeading: 'View More of Our Work',
  ctaHeading: 'Ready to Work with Us?',
  ctaPrimaryLabel: 'Apply as Nonprofit',
  ctaPrimaryHref: '/apply/nonprofit',
  ctaSecondaryLabel: "I'm a Student",
  ctaSecondaryHref: '/apply/student',
};

// TODO: Replace static section content with CMS fields when backend project schema is expanded.
// TODO: Replace visual-only social icons with real member social URLs once available.
export const PROJECT_PAGE_OVERRIDES: Record<string, Partial<ProjectPageStaticContent>> = {
  'camp-starfish': {
    partnerName: 'Camp Starfish',
    aboutHeading: 'About Camp Starfish',
    heroSubtitle:
      'A photo management platform that improves communication and planning for camp staff and families.',
    solutionScreenshotSrc: defaultFeatureImage,
    solutionScreenshotAlt: 'Camp Starfish platform screenshot',
  },
};
