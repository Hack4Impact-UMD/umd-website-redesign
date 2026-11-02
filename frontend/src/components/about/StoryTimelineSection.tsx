import type { AboutContent } from '@/content-schema/about';
import { resolveMediaUrl } from '@/lib/media';

type StoryTimelineSectionProps = NonNullable<AboutContent['story']>;

/**
 * Only the first item is dated (the founding); the rest describe how the
 * chapter works. So the founding gets a feature block and the rest sit in a
 * plain grid rather than pretending to be a timeline.
 */
export default function StoryTimelineSection({ heading, intro, items }: StoryTimelineSectionProps) {
  if (items.length === 0) return null;

  const [founding, ...rest] = items;
  const foundingImage = founding.image ? resolveMediaUrl(founding.image) : '';

  return (
    <section
      className="bg-white px-6 py-16 sm:px-8 lg:px-24 lg:py-24"
      aria-labelledby="about-story-heading"
    >
      <div className="mx-auto max-w-[1248px]">
        <header className="max-w-2xl">
          <h2 id="about-story-heading" className="text-section text-foreground">
            {heading}
          </h2>
          <p className="mt-4 font-body text-lg leading-relaxed text-text-secondary">{intro}</p>
        </header>

        <article className="mt-12 grid items-center gap-8 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          {foundingImage ? (
            <img
              src={foundingImage}
              alt={founding.imageAlt ?? ''}
              className="aspect-[4/3] w-full rounded-lg object-cover"
              loading="lazy"
            />
          ) : null}
          <div>
            <p className="font-heading text-label text-h4i-blue">{founding.label}</p>
            <h3 className="mt-2 font-heading text-3xl font-normal leading-tight tracking-tight text-foreground sm:text-4xl">
              {founding.title}
            </h3>
            <p className="mt-4 max-w-prose font-body text-lg leading-relaxed text-text-secondary">
              {founding.description}
            </p>
            {founding.links && founding.links.length > 0 ? (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                {founding.links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      target={link.href.startsWith('https://') ? '_blank' : undefined}
                      rel={link.href.startsWith('https://') ? 'noreferrer' : undefined}
                      className="font-heading text-label text-h4i-blue underline underline-offset-4 transition-colors hover:text-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>

        {rest.length > 0 ? (
          <ul className="mt-16 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {rest.map((item) => (
              <li key={`${item.label}-${item.title}`} className="border-t border-black/10 pt-5">
                <p className="font-heading text-label text-h4i-blue">{item.label}</p>
                <h3 className="mt-2 font-heading text-2xl font-normal leading-tight tracking-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-base leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
