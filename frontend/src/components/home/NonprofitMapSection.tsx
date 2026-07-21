import partnerMap from '@/components/assets/home/partner-map.png';
import type { HomeContent } from '@/content/home';
import { resolveMediaUrl } from '@/lib/media';
import HomeActionLink from './HomeActionLink';

interface NonprofitMapSectionProps {
  content: HomeContent['nonprofitMap'];
}

export default function NonprofitMapSection({ content }: NonprofitMapSectionProps) {
  if (content.mode === 'hidden') return null;

  const project = content.featuredProject;

  return (
    <section aria-labelledby="nonprofit-map-heading" className="px-4 py-10 sm:px-6 lg:px-24">
      <div className="mx-auto max-w-[1248px] overflow-hidden rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <header className="relative z-10 px-6 py-6 text-center sm:px-10">
          <h2 id="nonprofit-map-heading" className="text-[28px] leading-9 text-foreground">
            {content.heading}
          </h2>
          <p className="mt-2 font-heading text-lg font-bold leading-[30px] text-text-secondary sm:text-[22px]">
            {content.body}
          </p>
        </header>

        <div className="relative bg-[#F1F3F5] lg:min-h-[571px]">
          <div className="h-[340px] overflow-hidden bg-[#E7EFF8] sm:h-[440px] lg:h-[571px] lg:w-[81%]">
            <img
              src={partnerMap}
              alt="Illustrated nonprofit partner map preview"
              className="h-full w-full object-cover object-left"
            />
          </div>

          <aside className="m-4 rounded-lg bg-white p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] sm:m-6 lg:absolute lg:right-10 lg:top-1/2 lg:m-0 lg:w-[391px] lg:-translate-y-1/2 lg:p-8">
            {project ? (
              <div className="space-y-4">
                {project.logo && (
                  <img
                    src={resolveMediaUrl(project.logo)}
                    alt={project.logoAlt ?? ''}
                    className="h-[58px] w-[87px] object-cover"
                  />
                )}
                <div className="space-y-2">
                  <h3 className="text-[22px] leading-[30px] text-foreground">{project.title}</h3>
                  <p className="text-base leading-6 text-foreground sm:text-lg">{project.summary}</p>
                </div>
                <HomeActionLink
                  href={project.href}
                  className="inline-flex h-10 min-w-[199px] items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                >
                  View Project
                </HomeActionLink>
              </div>
            ) : (
              <div className="space-y-2" role="status">
                <h3 className="text-[22px] leading-[30px] text-foreground">{content.statusTitle}</h3>
                <p className="text-base leading-6 text-text-secondary sm:text-lg">
                  {content.statusDescription}
                </p>
              </div>
            )}
          </aside>
        </div>
      </div>
      <p className="sr-only">{content.statusTitle}. {content.statusDescription}</p>
    </section>
  );
}
