import {
  DEFAULT_STATIC_CONTENT,
  ProjectPageStaticContent,
} from '@/components/project_page/projectPageContent';
import type { MemberEntity, ProjectEntity } from '@/api';
import { formatSeason } from '@/lib/date';
import { resolveMediaUrl } from '@/lib/media';
import { isSafeHttpsUrl } from '@/lib/urls';

export type ProjectMember = MemberEntity;
export type ProjectApiItem = ProjectEntity;

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
  const attributes = projectApiItem.attributes;

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
    resolveMediaUrl(attributes.image.data[0]?.attributes.url) ||
    mergedStatic.solutionScreenshotSrc;

  const heroImageAlt =
    attributes.imageAltText ||
    `${attributes.title || mergedStatic.partnerName} project preview`;

  return {
    ...mergedStatic,
    title: attributes.title,
    path: attributes.path,
    seasonLabel: formatSeason(attributes.startDate),
    summary: attributes.summary,
    blurb: blurbText,
    repoURL: attributes.repoURL && isSafeHttpsUrl(attributes.repoURL) ? attributes.repoURL : undefined,
    hostedProjectURL:
      attributes.hostedProjectURL && isSafeHttpsUrl(attributes.hostedProjectURL)
        ? attributes.hostedProjectURL
        : undefined,
    heroImageSrc,
    heroImageAlt,
    members: attributes.members.data,
  };
}
