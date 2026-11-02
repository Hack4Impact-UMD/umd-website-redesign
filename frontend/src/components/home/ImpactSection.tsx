import type { HomeContent } from '@/content-schema/home';

interface ImpactSectionProps {
  content: HomeContent['impact'];
}

// dt comes first in the DOM (required inside a dl group) and flex-col-reverse
// puts the number on top visually.
function Stat({ value, label, lead = false }: { value: string; label: string; lead?: boolean }) {
  return (
    <div className={`flex flex-col-reverse justify-end border-t border-black/10 pt-4 ${lead ? 'col-span-2 lg:col-span-4' : ''}`}>
      <dt
        className={`mt-2 font-body leading-snug text-text-secondary ${
          lead ? 'text-lg sm:text-xl' : 'text-base'
        }`}
      >
        {label}
      </dt>
      <dd
        className={`font-heading font-normal tabular-nums tracking-tight text-h4i-blue ${
          lead ? 'text-6xl leading-none sm:text-8xl' : 'text-4xl leading-none sm:text-5xl'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}

export default function ImpactSection({ content }: ImpactSectionProps) {
  if (content.mode === 'hidden') return null;

  // The first verified stat is the lead number; editors choose it by ordering.
  const [lead, ...rest] = content.stats.filter((stat) => stat.verified);

  return (
    <section aria-labelledby="impact-heading" className="bg-white px-6 py-16 sm:px-8 lg:px-24 lg:py-24">
      <div className="mx-auto grid max-w-[1248px] gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <h2 id="impact-heading" className="text-section text-foreground">
            {content.heading}
          </h2>
          <p className="mt-4 max-w-sm font-body text-lg leading-relaxed text-text-secondary">
            What our student teams have delivered for nonprofit partners, and the community
            behind the work.
          </p>
        </div>

        {content.mode === 'published' && lead ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:col-span-8 lg:grid-cols-4">
            <Stat value={lead.value} label={lead.label} lead />
            {rest.map((stat) => (
              <Stat key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </dl>
        ) : (
          <p className="max-w-2xl text-lg text-muted-foreground lg:col-span-8" role="status">
            {content.placeholderMessage}
          </p>
        )}
      </div>
    </section>
  );
}
