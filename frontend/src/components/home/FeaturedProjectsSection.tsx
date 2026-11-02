import type { ProjectEntity } from '@/api';
import ProjectCard from '@/components/shared/ProjectCard';
import { resolveMediaUrl } from '@/lib/media';

interface FeaturedProjectsSectionProps {
  /** Fetched at build time by the page; already filtered to featured projects. */
  projects: ProjectEntity[];
}

const projectHref = (project: ProjectEntity) =>
  `/ourwork/${encodeURIComponent(project.attributes.path)}`;

const projectImage = (project: ProjectEntity) =>
  resolveMediaUrl(project.attributes.image.data[0]?.attributes.url) || undefined;

const projectSubtitle = (project: ProjectEntity) =>
  project.attributes.nonprofit?.data?.attributes.name ??
  (project.attributes.isCurrentProject ? 'Current project' : 'Community project');

export default function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  const [lead, ...rest] = projects;

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="bg-[#F1F3F5] px-6 py-16 sm:px-8 lg:px-24 lg:py-20"
    >
      <div className="mx-auto max-w-[1248px]">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="featured-projects-heading" className="text-section text-foreground">
            Featured projects
          </h2>
          <a
            href="/ourwork"
            className="font-heading text-label font-bold text-h4i-blue underline underline-offset-4 transition-colors hover:text-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            See all projects
          </a>
        </div>

        {!lead ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-base text-muted-foreground">
            No featured projects are available right now. Explore the full project library instead.
          </p>
        ) : (
          <>
            {/* One project gets room to explain itself; the rest follow as cards. */}
            <article className="grid items-center gap-8 lg:grid-cols-5 lg:gap-12">
              <a
                href={projectHref(lead)}
                className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-white ring-1 ring-black/5 lg:col-span-3"
                tabIndex={-1}
                aria-hidden="true"
              >
                {/* Shown at no more than natural size: most CMS images are small logos. */}
                {projectImage(lead) && (
                  <img
                    src={projectImage(lead)}
                    alt=""
                    className="absolute inset-0 m-auto h-auto max-h-[60%] w-auto max-w-[60%] object-contain"
                    loading="lazy"
                  />
                )}
              </a>
              <div className="lg:col-span-2">
                <p className="font-heading text-label text-h4i-blue">{projectSubtitle(lead)}</p>
                <h3 className="mt-2 font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
                  {lead.attributes.title}
                </h3>
                {lead.attributes.summary && (
                  <p className="mt-4 max-w-prose font-body text-lg leading-relaxed text-text-secondary">
                    {lead.attributes.summary}
                  </p>
                )}
                <a
                  href={projectHref(lead)}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                >
                  View project
                </a>
              </div>
            </article>

            {rest.length > 0 && (
              <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {rest.slice(0, 3).map((project) => (
                  <ProjectCard
                    key={project.id}
                    title={project.attributes.title}
                    path={project.attributes.path}
                    imageUrl={projectImage(project)}
                    imageAltText={project.attributes.imageAltText}
                    subtitle={projectSubtitle(project)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
