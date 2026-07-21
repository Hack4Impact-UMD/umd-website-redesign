import type { AboutContent } from '@/content/about';

type HighlightsSectionProps = NonNullable<AboutContent['highlights']>;

export default function HighlightsSection({ heading, items }: HighlightsSectionProps) {
  return (
    <section className="bg-inverse px-6 py-14 text-inverse-foreground sm:px-8 sm:py-16 lg:px-24 lg:py-20" aria-labelledby="about-highlights-heading">
      <div className="mx-auto max-w-[1216px]">
        <h2 id="about-highlights-heading" className="text-center font-heading text-h2 font-bold">
          {heading}
        </h2>
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 text-center sm:grid-cols-3 sm:gap-x-16 lg:mt-14 lg:gap-x-24 lg:gap-y-14">
          {items.map((item) => (
            <div key={`${item.value}-${item.label}`} className="min-w-0">
              <dt className="font-heading text-display font-bold leading-none sm:text-[44px]">{item.value}</dt>
              <dd className="mx-auto mt-3 max-w-[180px] font-karla text-body-small text-inverse-foreground/80">
                {item.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
