import { useMemo } from 'react';

import type { ProjectEntity } from '@/api';
import ApplyLink from '@/components/apply/ApplyLink';
import ProjectCard from '@/components/shared/ProjectCard';
import type { AboutContent } from '@/content-schema/about';
import { resolveMediaUrl } from '@/lib/media';

type CurrentProjectsSectionProps = Omit<AboutContent['currentProjects'], 'projectPaths'> & {
  projectPaths?: string[];
  /** Fetched at build time by the page; already filtered to current projects. */
  projectEntities: ProjectEntity[];
};

export default function CurrentProjectsSection({
  heading,
  linkLabel,
  linkHref,
  projectPaths = [],
  projectEntities,
}: CurrentProjectsSectionProps) {
  const projects = useMemo(() => {
    const currentProjects = projectEntities;
    if (projectPaths.length === 0) return currentProjects;

    const projectsByPath = new Map(
      currentProjects.map((project) => [project.attributes.path, project]),
    );
    return projectPaths.flatMap((path) => {
      const project = projectsByPath.get(path);
      return project ? [project] : [];
    });
  }, [projectPaths, projectEntities]);

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

        {projects.length === 0 ? (
          <p className="rounded-lg bg-card px-6 py-8 text-center text-base text-muted-foreground">
            No current project teams are available right now.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3 xl:gap-10">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.attributes.title}
                path={project.attributes.path}
                imageUrl={resolveMediaUrl(project.attributes.image.data[0]?.attributes.url) || undefined}
                imageAltText={project.attributes.imageAltText}
                subtitle={project.attributes.nonprofit?.data?.attributes.name ?? 'Current project'}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
