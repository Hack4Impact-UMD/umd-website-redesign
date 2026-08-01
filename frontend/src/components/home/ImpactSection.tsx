import type { HomeContent } from '@/content/home';

interface ImpactSectionProps {
  content: HomeContent['impact'];
}

export default function ImpactSection({ content }: ImpactSectionProps) {
  if (content.mode === 'hidden') return null;

  const verifiedStats = content.stats.filter((stat) => stat.verified);

  return (
    <section aria-labelledby="impact-heading" className="bg-white px-4 py-16 sm:px-6 lg:px-24 lg:py-20">
      <div className="mx-auto max-w-[1248px] text-center">
        <h2 id="impact-heading" className="text-[28px] leading-9 text-foreground">
          {content.heading}
        </h2>
        {content.mode === 'published' && verifiedStats.length > 0 ? (
          <dl className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-5 lg:gap-10">
            {verifiedStats.map((stat) => (
              <div key={stat.label} className="mx-auto flex max-w-[220px] flex-col items-center gap-4">
                <dd className="font-heading text-4xl font-bold leading-[48px] tracking-tight text-h4i-blue sm:text-5xl sm:leading-[56px]">
                  {stat.value}
                </dd>
                <dt className="min-h-12 text-lg leading-6 text-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground" role="status">
            {content.placeholderMessage}
          </p>
        )}
      </div>
    </section>
  );
}
