import type { ProjectEntity } from '@/api';
import ProjectCard from '@/components/shared/ProjectCard';
import { resolveMediaUrl } from '@/lib/media';

interface FeaturedProjectsSectionProps {
  /** Fetched at build time by the page; already filtered to featured projects. */
  projects: ProjectEntity[];
}

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="bg-[#F1F3F5] px-6 py-14 sm:px-8 lg:px-24 lg:py-20"
    >
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-8 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-heading text-label font-bold uppercase tracking-[0.16em] text-h4i-blue">
              Built for impact
            </p>
            <h2
              id="featured-projects-heading"
              className="mt-1 font-heading text-h2 font-bold text-foreground"
            >
              Featured Projects
            </h2>
          </div>
          <a
            href="/ourwork"
            className="font-heading text-label font-bold text-text-secondary underline underline-offset-4 transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            Explore all projects
          </a>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-base text-muted-foreground">
            No featured projects are available right now. Explore the full project library instead.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <ProjectCard
                key={project.id}
                title={project.attributes.title}
                path={project.attributes.path}
                imageUrl={resolveMediaUrl(project.attributes.image.data[0]?.attributes.url) || undefined}
                imageAltText={project.attributes.imageAltText}
                subtitle={
                  project.attributes.nonprofit?.data?.attributes.name ??
                  (project.attributes.isCurrentProject ? 'Current project' : 'Community project')
                }
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
