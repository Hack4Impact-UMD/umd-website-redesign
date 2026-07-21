import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { getProjects } from '@/api';
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
  const [activeIndex, setActiveIndex] = useState(0);
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

  useEffect(() => {
    setActiveIndex((index) => (projects.length === 0 ? 0 : Math.min(index, projects.length - 1)));
  }, [projects.length]);

  const activeProject = projects[activeIndex];
  const activeProjectImage = activeProject
    ? resolveMediaUrl(activeProject.attributes.image.data[0]?.attributes.url)
    : null;
  const hasMultipleProjects = projects.length > 1;
  const showPrevious = () =>
    setActiveIndex((index) => (index - 1 + projects.length) % projects.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % projects.length);

  return (
    <section
      className="relative isolate overflow-hidden bg-inverse px-6 py-12 sm:px-8 lg:px-24"
      aria-labelledby="current-projects-heading"
    >
      <img
        src={projectsBackground}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-primary/50" aria-hidden="true" />

      <div className="mx-auto max-w-[1248px]">
        <div className="mb-4 grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <span aria-hidden="true" className="hidden sm:block" />
          <h2
            id="current-projects-heading"
            className="text-center font-heading text-h2 font-bold text-inverse-foreground"
          >
            {heading}
          </h2>
          <ApplyLink
            href={linkHref}
            className="justify-self-center font-heading text-label font-bold text-inverse-foreground underline underline-offset-4 transition-opacity hover:opacity-80 sm:justify-self-end"
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
        ) : !activeProject ? (
          <p className="rounded-lg bg-card px-6 py-8 text-center text-base text-muted-foreground">
            No current project teams are published right now.
          </p>
        ) : (
          <article className="overflow-hidden rounded-lg bg-card shadow-lg">
            <div className="relative">
              <Link
                to={`/ourwork/${encodeURIComponent(activeProject.attributes.path)}`}
                aria-label={`View ${activeProject.attributes.title} project`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              >
                {activeProjectImage ? (
                  <img
                    src={activeProjectImage}
                    alt={
                      activeProject.attributes.imageAltText ??
                      `${activeProject.attributes.title} project team`
                    }
                    className="aspect-[1248/520] min-h-[260px] w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex aspect-[1248/520] min-h-[260px] items-center justify-center bg-muted text-base text-muted-foreground">
                    Project image unavailable
                  </div>
                )}
              </Link>

              {hasMultipleProjects ? (
                <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-4">
                  <button
                    type="button"
                    onClick={showPrevious}
                    className="rounded-lg bg-white/80 p-3 text-foreground shadow transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Show previous project"
                  >
                    <ArrowLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    className="rounded-lg bg-white/80 p-3 text-foreground shadow transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Show next project"
                  >
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              ) : null}
            </div>

            <Link
              to={`/ourwork/${encodeURIComponent(activeProject.attributes.path)}`}
              className="block px-6 py-6 text-foreground transition-colors hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-10"
              aria-label={`View ${activeProject.attributes.title} project`}
            >
              <h3 className="font-heading text-h2 font-bold">
                {activeProject.attributes.title}
              </h3>
              {activeProject.attributes.summary.trim() || activeProject.attributes.blurb.trim() ? (
                <p className="mt-2 text-body text-foreground">
                  {activeProject.attributes.summary.trim() || activeProject.attributes.blurb.trim()}
                </p>
              ) : null}
            </Link>
          </article>
        )}
      </div>
    </section>
  );
}
