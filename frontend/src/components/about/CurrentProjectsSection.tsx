import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProjects, type ProjectEntity } from '@/api';
import projectsBackground from '@/components/assets/about/projects-background.webp';
import ApplyLink from '@/components/apply/ApplyLink';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AsyncError } from '@/components/shared';
import type { AboutContent } from '@/content/about';
import { useApiResource } from '@/hooks';
import { resolveMediaUrl } from '@/lib/media';

type CurrentProjectsSectionProps = Omit<AboutContent['currentProjects'], 'projectPaths'> & {
  projectPaths?: string[];
};

export default function CurrentProjectsSection({
  heading,
  linkLabel,
  linkHref,
  projectPaths = [],
}: CurrentProjectsSectionProps) {
  const result = useApiResource(
    (signal) => getProjects({ filter: { kind: 'current', value: true }, signal }),
    [],
  );

  const projects = useMemo(() => {
    const currentProjects = result.data ?? [];
    if (projectPaths.length === 0) return currentProjects;

    const projectsByPath = new Map(
      currentProjects.map((project) => [project.attributes.path, project]),
    );
    return projectPaths.flatMap((path) => {
      const project = projectsByPath.get(path);
      return project ? [project] : [];
    });
  }, [projectPaths, result.data]);

  return (
    <section
      className="bg-[#F1F3F5] px-6 py-10 sm:px-8 sm:py-12 lg:px-24"
      aria-labelledby="current-projects-heading"
    >
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-6 grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden="true" className="hidden sm:block" />
          <h2
            id="current-projects-heading"
            className="text-center font-heading text-h2 font-bold text-foreground"
          >
            {heading}
          </h2>
          <ApplyLink
            href={linkHref}
            className="justify-self-center font-heading text-label font-bold text-text-secondary underline underline-offset-4 transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2 sm:justify-self-end"
          >
            {linkLabel}
          </ApplyLink>
        </div>

        {result.status === 'loading' ? (
          <div className="rounded-lg bg-card p-10">
            <LoadingSpinner text="Loading current projects..." />
          </div>
        ) : result.status === 'error' ? (
          <div className="rounded-lg bg-card p-6">
            <AsyncError message="Current projects are unavailable right now." onRetry={result.retry} />
          </div>
        ) : projects.length === 0 ? (
          <p className="rounded-lg bg-card px-6 py-8 text-center text-base text-muted-foreground">
            No current project teams are published right now.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-10">
            {projects.map((project) => (
              <CurrentProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type CurrentProjectCardProps = {
  project: ProjectEntity;
};

function CurrentProjectCard({ project }: CurrentProjectCardProps) {
  const [isLogo, setIsLogo] = useState(false);
  const imageUrl = resolveMediaUrl(project.attributes.image.data[0]?.attributes.url);
  const title = project.attributes.title;
  const partnerName = project.attributes.nonprofit?.data?.attributes.name;
  const href = `/ourwork/${encodeURIComponent(project.attributes.path)}`;

  return (
    <article className="group relative h-[400px] overflow-hidden rounded-lg bg-card shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
      <Link
        to={href}
        aria-label={`View ${title} project`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue"
      >
        <div className="relative h-[318px] overflow-hidden bg-slate-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              aria-hidden="true"
              className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${
                isLogo ? 'opacity-0' : 'object-cover'
              }`}
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
                alt={project.attributes.imageAltText ?? `${title} logo`}
                className="h-full w-full object-contain"
              />
            </div>
          ) : null}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex min-h-[82px] items-center gap-4 rounded-b-lg bg-[#0056A3] px-5 py-3 text-white">
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-heading text-[22px] font-bold leading-[30px]">{title}</h3>
            <p className="truncate text-label font-bold">{partnerName ?? 'Current project'}</p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/30">
            <ArrowRight className="h-[15px] w-[15px]" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
