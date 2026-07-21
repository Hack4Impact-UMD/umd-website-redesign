import type { AboutContent } from '@/content/about';
import { resolveMediaUrl } from '@/lib/media';

type StoryTimelineSectionProps = NonNullable<AboutContent['story']>;

export default function StoryTimelineSection({ heading, intro, items }: StoryTimelineSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-muted/55 px-6 py-12 sm:px-8 sm:py-16 lg:px-24 lg:py-20" aria-labelledby="our-story-heading">
      <div className="mx-auto max-w-[1040px]">
        <div className="mx-auto mb-10 max-w-[760px] text-center sm:mb-14">
          <h2 id="our-story-heading" className="font-heading text-h2 font-bold text-foreground">
            {heading}
          </h2>
          <p className="mt-3 font-karla text-body text-text-secondary">{intro}</p>
        </div>

        <ol className="relative space-y-7 before:absolute before:bottom-8 before:left-5 before:top-8 before:w-px before:bg-primary/70 md:space-y-0 md:before:left-1/2 md:before:-translate-x-1/2">
          {items.map((item, index) => {
            const imageSrc = item.image ? resolveMediaUrl(item.image) : null;
            const isLeft = index % 2 === 0;

            return (
              <li
                key={`${item.label}-${item.title}`}
                className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] md:gap-7"
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 border-muted bg-primary font-heading text-xs font-bold text-primary-foreground md:col-start-2 md:h-16 md:w-16 md:text-sm">
                  <span className="sr-only">Story step </span>
                  {index + 1}
                </div>
                <article
                  className={`rounded-lg border border-border bg-card p-5 shadow-sm md:row-start-1 md:p-6 ${
                    isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3'
                  }`}
                >
                  <p className="font-heading text-label text-primary">{item.label}</p>
                  <h3 className="mt-1 font-heading text-h3 font-bold text-foreground">{item.title}</h3>
                  <div className={`mt-3 flex gap-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.imageAlt ?? ''}
                        className="h-[72px] w-[88px] shrink-0 rounded-md object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <p className="font-karla text-body-small text-text-secondary">{item.description}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
