import { ArrowRight } from 'lucide-react';

import projectsBackground from '@/components/assets/about/projects-background.webp?url';

type ProjectCardProps = {
  title: string;
  path: string;
  imageUrl?: string;
  imageAltText?: string;
  subtitle?: string;
  /** Shows the image as a small logo badge over a pattern instead of a full preview. */
  isLogo?: boolean;
};

export default function ProjectCard({
  title,
  path,
  imageUrl,
  imageAltText,
  subtitle,
  isLogo = false,
}: ProjectCardProps) {
  const href = `/ourwork/${encodeURIComponent(path)}`;

  return (
    <article className="h-full">
      <a
        href={href}
        aria-label={`View ${title} project`}
        className="group flex h-full flex-col overflow-hidden rounded-lg bg-white ring-1 ring-black/5 transition-shadow hover:shadow-[0_8px_24px_rgba(0,26,51,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2 motion-reduce:transition-none"
      >
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden border-b border-black/5 bg-white">
          {imageUrl && isLogo ? (
            <>
              <img
                src={projectsBackground}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
              />
              <div className="absolute left-4 top-4 flex h-[62px] w-[67px] items-center justify-center rounded-lg bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <img
                  src={imageUrl}
                  alt={imageAltText ?? `${title} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            </>
          ) : imageUrl ? (
            // CMS images are mostly logos, some only ~200px: show them at no more
            // than their natural size, centred, rather than stretched to fill.
            <img
              src={imageUrl}
              alt={imageAltText ?? `${title} project preview`}
              className="absolute inset-0 m-auto h-auto max-h-[70%] w-auto max-w-[70%] object-contain"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {subtitle ? (
            <p className="truncate font-heading text-label text-h4i-blue">{subtitle}</p>
          ) : null}
          <div className="mt-2 flex flex-1 items-end justify-between gap-4">
            <h3 className="line-clamp-2 self-start font-heading text-2xl font-normal leading-tight tracking-tight text-foreground transition-colors group-hover:text-h4i-blue motion-reduce:transition-none">
              {title}
            </h3>
            <ArrowRight
              aria-hidden="true"
              className="mb-1 h-5 w-5 shrink-0 text-h4i-blue transition-transform duration-200 group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-focus-visible:translate-x-0"
            />
          </div>
        </div>
      </a>
    </article>
  );
}
