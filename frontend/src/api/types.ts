export type MemberDisplayStatus =
  | 'Current Member'
  | 'Current Board Member'
  | 'Former Member or Board Member';

export interface RoleData {
  title: string;
  isDisplayRole: boolean;
  team?: string;
  startDate?: string;
  endDate?: string;
}

export interface StrapiMediaEntity {
  id: string;
  attributes: {
    url: string;
  };
}

export interface StrapiMemberAttributes {
  firstName: string;
  lastName: string;
  pronouns?: string;
  memberDisplayStatus: MemberDisplayStatus;
  componentRolesArr: RoleData[];
  avatar: {
    data: StrapiMediaEntity | null;
  };
}

export interface StrapiProjectAttributes {
  title: string;
  path: string;
  startDate?: string;
  summary: string;
  blurb: string;
  isFeatured: boolean;
  isCurrentProject: boolean;
  repoURL?: string;
  hostedProjectURL?: string;
  imageAltText?: string;
  nonprofit?: {
    data:
      | {
          id: string;
          attributes: {
            name: string;
          };
        }
      | null;
  };
  image: {
    data: StrapiMediaEntity[];
  };
  members: {
    data: StrapiEntity<StrapiMemberAttributes>[];
  };
}

export interface StrapiEntity<TAttributes> {
  id: string;
  attributes: TAttributes;
}

export interface StrapiCollectionResponse<TAttributes> {
  data: Array<StrapiEntity<TAttributes>>;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ContentResponse<TData> {
  data: TData | null;
  meta: {
    collection: string;
    documentId: string;
  };
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface HomeContent {
  hero: {
    heading: string;
    body: string;
    slides: Array<{ image: string; alt: string }>;
    primaryCta: CtaLink;
    secondaryCta: CtaLink;
  };
  nonprofitMap: {
    heading: string;
    body: string;
    statusTitle: string;
    statusDescription: string;
  };
  testimonials: {
    heading: string;
    items: Array<{ quote: string; name: string; organization: string }>;
  };
  newsletter: {
    heading: string;
    body: string;
    subscribeHeading: string;
    subscribeSuccessMessage: string;
    card: {
      date: string;
      sender: string;
      title: string;
      recapTitle: string;
      recapBody: string;
    };
    stats: Array<{ value: string; label: string }>;
  };
  sponsors: {
    heading: string;
    tiers: Array<{
      name: string;
      sponsors: Array<{ name: string; logo: string }>;
    }>;
  };
  cta: {
    heading: string;
    primary: CtaLink;
    secondary: CtaLink;
  };
}

export interface AboutContent {
  header: {
    title: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
  };
  mission: {
    heading: string;
    body: string;
  };
  values: {
    heading: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      imageAlt?: string;
    }>;
  };
  currentProjects: {
    heading: string;
    linkLabel: string;
    linkHref: string;
  };
}

export interface OurWorkContent {
  header: {
    title: string;
    subtitle: string;
    image: string;
    imageAlt: string;
  };
}

export interface ApplyTimelineStep {
  title: string;
  subtitle: string;
  description: string;
}

export interface ApplyFaqItem {
  question: string;
  answer: string;
}

export interface ApplyTestimonial {
  quote: string;
  name: string;
  organization: string;
}

export interface ApplyStudentRole {
  title: string;
  description: string;
  icon: string;
}

export interface ApplyStudentContent {
  hero: {
    title: string;
    image: string;
  };
  intro: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
  roles: ApplyStudentRole[];
  timeline: {
    heading: string;
    description?: string;
    steps: ApplyTimelineStep[];
  };
  testimonials: ApplyTestimonial[];
  faq: {
    heading: string;
    items: ApplyFaqItem[];
  };
  cta: {
    heading: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}

export interface ApplyNonprofitContent {
  hero: {
    title: string;
    image: string;
  };
  banner?: {
    enabled: boolean;
    text: string;
  };
  intro: {
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };
  criteria: {
    heading: string;
    paragraphs: string[];
  };
  timeline: {
    heading: string;
    description?: string;
    steps: ApplyTimelineStep[];
  };
  testimonials: ApplyTestimonial[];
  faq: {
    heading: string;
    items: ApplyFaqItem[];
  };
  cta: {
    heading: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
}

export interface SiteSettings {
  navbar: {
    links: Array<{
      label: string;
      href: string;
      dropdown?: Array<{ label: string; href: string }>;
    }>;
  };
  footer: {
    newsletterPrompt: string;
    exploreLinks: Array<{ label: string; href: string }>;
    applyLinks: Array<{ label: string; href: string }>;
    socialLinks: Array<{ label: string; href: string; icon: string }>;
    contact: {
      addressLines: string[];
      email: string;
    };
  };
  branding: {
    logo: string;
  };
}
