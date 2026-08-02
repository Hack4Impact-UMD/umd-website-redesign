import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import { getProjects } from '@/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AsyncError } from '@/components/shared';
import { useApiResource } from '@/hooks';
import { resolveMediaUrl } from '@/lib/media';

export default function FeaturedProjectsSection() {
  const result = useApiResource(
    (signal) => getProjects({ filter: { kind: 'featured', value: true }, signal }),
    [],
  );

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
          <Link
            to="/ourwork"
            className="font-heading text-label font-bold text-text-secondary underline underline-offset-4 transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            Explore all projects
          </Link>
        </div>

        {result.status === 'loading' ? (
          <div className="rounded-lg bg-white p-10">
            <LoadingSpinner text="Loading featured projects..." />
          </div>
        ) : result.status === 'error' ? (
          <div className="rounded-lg bg-white p-6">
            <AsyncError message="Featured projects are unavailable right now." onRetry={result.retry} />
          </div>
        ) : (result.data ?? []).length === 0 ? (
          <p className="rounded-lg bg-white px-6 py-8 text-center text-base text-muted-foreground">
            No featured projects are available right now. Explore the full project library instead.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {(result.data ?? []).slice(0, 6).map((project) => {
              const imageUrl = resolveMediaUrl(project.attributes.image.data[0]?.attributes.url);
              const partnerName = project.attributes.nonprofit?.data?.attributes.name;
              const title = project.attributes.title;

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                >
                  <Link
                    to={`/ourwork/${encodeURIComponent(project.attributes.path)}`}
                    aria-label={`View ${title} project`}
                    className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-h4i-blue"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-h4i-blue-light to-white">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.attributes.imageAltText ?? `${title} project preview`}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className="flex min-h-24 items-center gap-4 bg-[#0056A3] px-5 py-4 text-white">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-heading text-[22px] font-bold leading-7">{title}</h3>
                        <p className="mt-1 text-sm font-bold text-white/85">
                          {partnerName ?? (project.attributes.isCurrentProject ? 'Current project' : 'Community project')}
                        </p>
                      </div>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-white/25">
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
