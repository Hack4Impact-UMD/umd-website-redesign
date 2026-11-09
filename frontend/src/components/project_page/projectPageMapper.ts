import type { MemberEntity, ProjectEntity } from '@/api';
import { formatSeason } from '@/lib/date';
import { resolveMediaUrl } from '@/lib/media';
import { screenshotFrame, type ScreenshotFrame } from '@/lib/screenshots';
import { isSafeHttpsUrl } from '@/lib/urls';

export type ProjectMember = MemberEntity;
export type ProjectApiItem = ProjectEntity;

export interface ProjectScreenshotView {
  src: string;
  alt: string;
  /** The editor's own description, when there is one; never the generic fallback. */
  caption?: string;
  frame: ScreenshotFrame;
  width?: number;
  height?: number;
}

export interface ProjectPageViewModel {
  title: string;
  path: string;
  seasonLabel: string;
  summary: string;
  overviewParagraphs: string[];
  isCurrentProject: boolean;
  partnerName?: string;
  repoURL?: string;
  hostedProjectURL?: string;
  heroImageSrc?: string;
  heroImageAlt: string;
  /** Product screenshots: the first goes in the hero, the rest in a row below. */
  screenshots: ProjectScreenshotView[];
  members: ProjectMember[];
}

export function plainTextParagraphs(input?: string): string[] {
  if (!input) {
    return [];
  }

  return input
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, '\n\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .split(/\n{2,}/)
    .map((segment) => segment.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

export function buildProjectPageViewModel(
  projectApiItem: ProjectApiItem,
): ProjectPageViewModel {
  const attributes = projectApiItem.attributes;
  const heroImageSrc = resolveMediaUrl(attributes.image.data[0]?.attributes.url) || undefined;

  const heroImageAlt =
    attributes.imageAltText ||
    `${attributes.title} project preview`;

  const screenshots = (attributes.screenshots?.data ?? []).flatMap(({ attributes: shot }, index, all) => {
    const src = resolveMediaUrl(shot.url);
    if (!src) return [];
    const generic = all.length > 1 ? `Screenshot ${index + 1} of ${attributes.title}` : `Screenshot of ${attributes.title}`;
    return [
      {
        src,
        alt: shot.alternativeText || generic,
        caption: shot.alternativeText || undefined,
        frame: screenshotFrame(shot.width, shot.height),
        width: shot.width,
        height: shot.height,
      },
    ];
  });

  return {
    title: attributes.title,
    path: attributes.path,
    seasonLabel: formatSeason(attributes.startDate),
    summary: attributes.summary.trim(),
    overviewParagraphs: plainTextParagraphs(attributes.blurb),
    isCurrentProject: attributes.isCurrentProject,
    partnerName: attributes.nonprofit?.data?.attributes.name,
    repoURL: attributes.repoURL && isSafeHttpsUrl(attributes.repoURL) ? attributes.repoURL : undefined,
    hostedProjectURL:
      attributes.hostedProjectURL && isSafeHttpsUrl(attributes.hostedProjectURL)
        ? attributes.hostedProjectURL
        : undefined,
    heroImageSrc,
    heroImageAlt,
    screenshots,
    members: attributes.members.data,
  };
}
