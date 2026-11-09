import { useMemo } from 'react';

import type { ProjectEntity } from '@/api';
import ApplyLink from '@/components/apply/ApplyLink';
import ProjectCard from '@/components/shared/ProjectCard';
import type { AboutContent } from '@/content-schema/about';
import { resolveMediaUrl } from '@/lib/media';
import { cardScreenshot } from '@/lib/screenshots';

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
      className="bg-white px-6 py-16 sm:px-8 lg:px-24 lg:py-24"
      aria-labelledby="current-projects-heading"
    >
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="current-projects-heading" className="text-section text-foreground">
            {heading}
          </h2>
          <ApplyLink
            href={linkHref}
            className="font-heading text-label font-bold text-h4i-blue underline underline-offset-4 transition-colors hover:text-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            {linkLabel}
          </ApplyLink>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg bg-[#F1F3F5] px-6 py-8 text-center text-base text-muted-foreground">
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
                screenshot={cardScreenshot(project.attributes, resolveMediaUrl)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
