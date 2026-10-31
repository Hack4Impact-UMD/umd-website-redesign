import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

import projectsBackground from '@/components/assets/about/projects-background.webp?url';

type ProjectCardProps = {
  title: string;
  path: string;
  imageUrl?: string;
  imageAltText?: string;
  subtitle?: string;
};

export default function ProjectCard({
  title,
  path,
  imageUrl,
  imageAltText,
  subtitle,
}: ProjectCardProps) {
  const [isLogo, setIsLogo] = useState(false);
  const href = `/ourwork/${encodeURIComponent(path)}`;

  return (
    <article className="group relative h-[400px] overflow-hidden rounded-lg bg-card shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <a
        href={href}
        aria-label={`View ${title} project`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue"
      >
        <div className="relative h-[318px] overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className={`h-full w-full object-contain ${isLogo ? 'opacity-0' : ''}`}
              onLoad={(event) => {
                const { naturalHeight, naturalWidth } = event.currentTarget;
                setIsLogo(naturalWidth > 0 && naturalHeight > 0 && naturalWidth / naturalHeight > 0.82 && naturalWidth / naturalHeight < 1.22);
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-h4i-blue-light to-white" />
          )}
          {isLogo ? (
            <img
              src={projectsBackground}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-[0.14]"
            />
          ) : null}
          {imageUrl && isLogo ? (
            <div className="absolute left-4 top-4 flex h-[62px] w-[67px] items-center justify-center rounded-lg bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <img
                src={imageUrl}
                alt={imageAltText ?? `${title} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex min-h-[82px] items-center gap-4 rounded-b-lg bg-[#0056A3] px-5 py-3 text-white">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-[22px] font-bold leading-[30px]">{title}</h3>
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
