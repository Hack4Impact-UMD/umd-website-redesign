import {
  DEFAULT_STATIC_CONTENT,
  ProjectPageStaticContent,
} from '@/components/project_page/projectPageContent';

type MemberRole = {
  title?: string;
  team?: string;
  isDisplayRole?: boolean;
};

export type ProjectMember = {
  id: number;
  attributes?: {
    firstName?: string;
    lastName?: string;
    pronouns?: string;
    avatar?: {
      data?: {
        attributes?: {
          url?: string;
        };
      } | null;
    };
    componentRolesArr?: MemberRole[];
  };
};

export type ProjectApiItem = {
  id: number;
  attributes?: {
    title?: string;
    path?: string;
    startDate?: string;
    summary?: string;
    blurb?: string;
    repoURL?: string;
    hostedProjectURL?: string;
    imageAltText?: string;
    image?: {
      data?: Array<{
        attributes?: {
          url?: string;
        };
      }>;
    };
    members?: {
      data?: ProjectMember[];
    };
  };
};

export interface ProjectPageViewModel extends ProjectPageStaticContent {
  title: string;
  path: string;
  seasonLabel: string;
  summary: string;
  blurb: string;
  repoURL?: string;
  hostedProjectURL?: string;
  heroImageSrc: string;
  heroImageAlt: string;
  members: ProjectMember[];
}

function resolveAssetUrl(src?: string): string {
  if (!src) {
    return '';
  }

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }

  if (src.startsWith('/')) {
    return `${import.meta.env.VITE_ROOT_URL}${src}`;
  }

  return `${import.meta.env.VITE_ROOT_URL}/${src}`;
}

function seasonFromDate(startDate?: string): string {
  if (!startDate || startDate.length < 7) {
    return '';
  }

  const month = Number(startDate.substring(5, 7));
  const year = startDate.substring(0, 4);

  if (Number.isNaN(month)) {
    return year;
  }

  if (month >= 2 && month <= 5) {
    return `Spring ${year}`;
  }

  if (month >= 6 && month <= 7) {
    return `Summer ${year}`;
  }

  if (month >= 8 && month <= 11) {
    return `Fall ${year}`;
  }

  return `Winter ${year}`;
}

function normalizeRichText(input?: string): string {
  if (!input) {
    return '';
  }

  const withoutTags = input.replace(/<[^>]+>/g, ' ');
  return withoutTags.replace(/\s+/g, ' ').trim();
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function buildProjectPageViewModel(
  projectApiItem: ProjectApiItem,
  staticOverride?: Partial<ProjectPageStaticContent>,
): ProjectPageViewModel {
  const attributes = projectApiItem.attributes ?? {};

  const blurbText = normalizeRichText(attributes.blurb);
  const mergedStatic: ProjectPageStaticContent = {
    ...DEFAULT_STATIC_CONTENT,
    ...staticOverride,
  };

  if (
    !staticOverride?.aboutParagraphs ||
    staticOverride.aboutParagraphs.length === 0
  ) {
    const derivedParagraphs = splitParagraphs(blurbText);
    if (derivedParagraphs.length > 0) {
      mergedStatic.aboutParagraphs = derivedParagraphs;
    }
  }

  if (
    (!staticOverride?.partnerName || staticOverride.partnerName.trim().length === 0) &&
    attributes.title
  ) {
    mergedStatic.partnerName = attributes.title;
  }

  if (
    !staticOverride?.aboutHeading ||
    staticOverride.aboutHeading.trim().length === 0
  ) {
    mergedStatic.aboutHeading = `About ${mergedStatic.partnerName}`;
  }

  const heroImageSrc =
    resolveAssetUrl(attributes.image?.data?.[0]?.attributes?.url) ||
    mergedStatic.solutionScreenshotSrc;

  const heroImageAlt =
    attributes.imageAltText ||
    `${attributes.title || mergedStatic.partnerName} project preview`;

  return {
    ...mergedStatic,
    title: attributes.title || 'Project',
    path: attributes.path || '',
    seasonLabel: seasonFromDate(attributes.startDate),
    summary: attributes.summary || '',
    blurb: blurbText,
    repoURL: attributes.repoURL,
    hostedProjectURL: attributes.hostedProjectURL,
    heroImageSrc,
    heroImageAlt,
    members: attributes.members?.data || [],
  };
}
