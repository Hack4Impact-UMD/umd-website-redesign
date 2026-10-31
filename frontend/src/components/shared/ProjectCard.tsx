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
    <article className="relative h-[400px] overflow-hidden rounded-lg bg-card shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <a
        href={href}
        aria-label={`View ${title} project`}
        className="absolute inset-0 flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue"
      >
        <div className="relative min-h-0 flex-1 overflow-hidden bg-slate-100">
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
            <img
              src={imageUrl}
              alt={imageAltText ?? `${title} project preview`}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-h4i-blue-light to-white" />
          )}
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-b-lg bg-[#0056A3] px-5 py-3 text-white">
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 min-h-[60px] font-heading text-[22px] font-bold leading-[30px]">{title}</h3>
            {subtitle ? <p className="truncate text-label font-bold">{subtitle}</p> : null}
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/30">
            <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
          </span>
        </div>
      </a>
    </article>
  );
}
