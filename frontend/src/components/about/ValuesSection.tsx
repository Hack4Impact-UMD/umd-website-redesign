import type { AboutContent } from '@/content-schema/about';

type ValuesSectionProps = AboutContent['values'];

// Text-only: the value photos repeat ones already used higher on the page, and
// the values read better as statements than as image cards.
export default function ValuesSection({ heading, items }: ValuesSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className="bg-[#F1F3F5] px-6 py-16 sm:px-8 lg:px-24 lg:py-24"
      aria-labelledby="about-values-heading"
    >
      <div className="mx-auto grid max-w-[1248px] gap-10 lg:grid-cols-12 lg:gap-16">
        <h2 id="about-values-heading" className="text-section text-foreground lg:col-span-4">
          {heading}
        </h2>
        <ul className="lg:col-span-8">
          {items.map((value) => (
            <li
              key={value.title}
              className="grid gap-3 border-t border-black/10 py-8 first:pt-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8"
            >
              <h3 className="font-heading text-2xl font-normal leading-tight tracking-tight text-foreground sm:text-3xl">
                {value.title}
              </h3>
              <p className="font-body text-lg leading-relaxed text-text-secondary">{value.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
