import { ArrowRight } from 'lucide-react';

import projectsBackground from '@/components/assets/about/projects-background.webp?url';
import type { CardScreenshot } from '@/lib/screenshots';
import ScreenshotPeek from './ScreenshotPeek';

type ProjectCardProps = {
  title: string;
  path: string;
  imageUrl?: string;
  imageAltText?: string;
  subtitle?: string;
  /** Shows the image as a small logo badge over a pattern instead of a full preview. */
  isLogo?: boolean;
  /** When present, the product screenshot takes the image's place. */
  screenshot?: CardScreenshot;
  /**
   * `wide` spans its grid row: text on the left, the screenshot on the right.
   * Only meaningful with a screenshot.
   */
  variant?: 'default' | 'wide';
  /** Shown on wide cards. */
  summary?: string;
  className?: string;
};

const CARD_LINK =
  'group overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(0,26,51,0.06),0_4px_14px_rgba(0,26,51,0.07)] ring-1 ring-black/10 transition-shadow hover:shadow-[0_2px_4px_rgba(0,26,51,0.06),0_12px_28px_rgba(0,26,51,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2 motion-reduce:transition-none';

const ARROW =
  'h-5 w-5 shrink-0 text-h4i-blue transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0';

function Media({ title, imageUrl, imageAltText, isLogo }: Pick<ProjectCardProps, 'title' | 'imageUrl' | 'imageAltText' | 'isLogo'>) {
  if (imageUrl && isLogo) {
    return (
      <>
        <img
          src={projectsBackground}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
        />
        <div className="absolute left-4 top-4 flex h-[62px] w-[67px] items-center justify-center rounded-lg bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
          <img src={imageUrl} alt={imageAltText ?? `${title} logo`} className="h-full w-full object-contain" />
        </div>
      </>
    );
  }
  if (!imageUrl) return null;
  // CMS images are mostly logos, some only ~200px: show them at no more
  // than their natural size, centred, rather than stretched to fill.
  return (
    <img
      src={imageUrl}
      alt={imageAltText ?? `${title} project preview`}
      className="absolute inset-0 m-auto h-auto max-h-[70%] w-auto max-w-[70%] object-contain"
      loading="lazy"
    />
  );
}

/**
 * The partner logo, set straight on the card at the height of a line of type
 * and aligned to the text below it. Wide wordmarks are capped so they do not
 * outweigh the title.
 */
export function PartnerLogo({ src, title, className = '' }: { src: string; title: string; className?: string }) {
  return (
    <img
      src={src}
      alt={`${title} partner logo`}
      loading="lazy"
      className={`block h-7 w-auto max-w-[140px] object-contain object-left ${className}`}
    />
  );
}

export default function ProjectCard({
  title,
  path,
  imageUrl,
  imageAltText,
  subtitle,
  isLogo = false,
  screenshot,
  variant = 'default',
  summary,
  className = '',
}: ProjectCardProps) {
  const href = `/ourwork/${encodeURIComponent(path)}`;

  if (screenshot && variant === 'wide') {
    return (
      <article className={`h-full ${className}`}>
        <a
          href={href}
          aria-label={`View ${title} project`}
          className={`${CARD_LINK} flex h-full flex-col md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]`}
        >
          <div className="order-2 flex flex-col p-6 sm:p-8 md:order-1 lg:p-10">
            {screenshot.logoUrl ? <PartnerLogo src={screenshot.logoUrl} title={title} className="mb-5" /> : null}
            {subtitle ? <p className="truncate font-heading text-label text-h4i-blue">{subtitle}</p> : null}
            <h3 className="mt-2 font-heading text-3xl font-normal leading-tight tracking-tight text-foreground transition-colors group-hover:text-h4i-blue motion-reduce:transition-none sm:text-4xl">
              {title}
            </h3>
            {summary ? (
              <p className="mt-4 line-clamp-4 max-w-prose font-body text-base leading-relaxed text-text-secondary">
                {summary}
              </p>
            ) : null}
            <span className="mt-auto inline-flex items-center gap-2 pt-6 font-heading text-base font-bold text-h4i-blue">
              View project
              <ArrowRight aria-hidden="true" className={ARROW} />
            </span>
          </div>
          <ScreenshotPeek screenshot={screenshot} className="order-1 aspect-[16/10] md:order-2 md:aspect-auto md:min-h-[340px]" />
        </a>
      </article>
    );
  }

  return (
    <article className={`h-full ${className}`}>
      <a href={href} aria-label={`View ${title} project`} className={`${CARD_LINK} flex h-full flex-col`}>
        {screenshot ? (
          <ScreenshotPeek screenshot={screenshot} className="aspect-[16/10] shrink-0" />
        ) : (
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-black/10 bg-white">
            <Media title={title} imageUrl={imageUrl} imageAltText={imageAltText} isLogo={isLogo} />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {screenshot?.logoUrl ? <PartnerLogo src={screenshot.logoUrl} title={title} className="mb-4" /> : null}
          {subtitle ? <p className="truncate font-heading text-label text-h4i-blue">{subtitle}</p> : null}
          <div className="mt-2 flex flex-1 items-end justify-between gap-4">
            <h3 className="line-clamp-2 self-start font-heading text-2xl font-normal leading-tight tracking-tight text-foreground transition-colors group-hover:text-h4i-blue motion-reduce:transition-none">
              {title}
            </h3>
            <ArrowRight aria-hidden="true" className={`mb-1 ${ARROW}`} />
          </div>
        </div>
      </a>
    </article>
  );
}
