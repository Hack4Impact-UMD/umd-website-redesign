import type { AboutContent } from '@/content/about';
import { resolveMediaUrl } from '@/lib/media';

type StoryTimelineSectionProps = NonNullable<AboutContent['story']>;

export default function StoryTimelineSection({ intro, items }: StoryTimelineSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[#F1F3F5] px-6 py-10 sm:px-8 sm:py-12 lg:px-24" aria-label="Our story">
      <div className="mx-auto max-w-[1248px]">
        <p className="mx-auto max-w-[1242px] text-center font-heading text-[18px] font-semibold leading-7 text-foreground sm:text-[22px] sm:leading-9">
          {intro}
        </p>

        <ol className="relative mt-12 space-y-14 before:absolute before:bottom-7 before:left-5 before:top-7 before:w-1 before:rounded before:bg-h4i-blue md:mt-20 md:space-y-20 md:before:left-1/2 md:before:-translate-x-1/2">
          {items.map((item, index) => {
            const imageSrc = item.image ? resolveMediaUrl(item.image) : null;
            const isLeft = index % 2 === 0;

            return (
              <li
                key={`${item.label}-${item.title}`}
                className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] md:gap-8"
              >
                <span aria-hidden="true" className="relative z-10 mt-6 h-[26px] w-[26px] rounded-full bg-h4i-blue md:col-start-2 md:mt-20 md:justify-self-center" />
                <article
                  aria-label={`${item.label}: ${item.title}`}
                  className={`rounded-lg bg-card p-6 shadow-[0_4px_12px_rgba(0,0,0,0.1)] md:row-start-1 md:p-8 ${
                    isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3'
                  }`}
                >
                  <div className={`flex gap-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-heading text-h3 font-bold text-foreground">{item.label}</h3>
                      <p className="mt-1 font-heading text-label font-bold text-h4i-blue">{item.title}</p>
                      <p className="mt-2 font-karla text-body text-foreground">{item.description}</p>
                      {item.links && item.links.length > 0 ? (
                        <ul className={`mt-3 flex flex-wrap gap-x-4 gap-y-2 ${isLeft ? 'md:justify-end' : ''}`}>
                          {item.links.map((link) => (
                            <li key={`${link.label}-${link.href}`}>
                              <a
                                href={link.href}
                                target={link.href.startsWith('https://') ? '_blank' : undefined}
                                rel={link.href.startsWith('https://') ? 'noreferrer' : undefined}
                                className="font-heading text-label font-bold text-h4i-blue underline underline-offset-4 hover:text-state-primary-hover"
                              >
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={item.imageAlt ?? ''}
                        className="h-[112px] w-[128px] shrink-0 rounded-lg object-cover sm:h-[132px] sm:w-[150px] md:h-[154px] md:w-[174px]"
                        loading="lazy"
                      />
                    ) : null}
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
