import type { AboutContent } from '@/content/about';
import { resolveMediaUrl } from '@/lib/media';

type ValuesSectionProps = AboutContent['values'];

export default function ValuesSection({ heading, items }: ValuesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-12 sm:px-8 sm:py-16 lg:px-24 lg:py-20" aria-labelledby="about-values-heading">
      <div className="mx-auto max-w-[1248px]">
        <h2 id="about-values-heading" className="mb-10 text-center font-heading text-h2 font-bold text-foreground">
          {heading}
        </h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-10">
          {items.map((value) => (
            <div key={value.title}>
              {resolveMediaUrl(value.image) ? (
                <img
                  src={resolveMediaUrl(value.image) ?? undefined}
                  alt={value.imageAlt}
                  className="aspect-[385/347] w-full rounded-lg object-cover object-center shadow-sm"
                  loading="lazy"
                />
              ) : null}
              <h3 className="mt-4 font-heading text-h3 font-bold text-foreground">
                {value.title}
              </h3>
              <p className="mt-2 font-karla text-body text-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
