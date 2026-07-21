import type { HomeContent } from '@/content/home';
import { resolveMediaUrl } from '@/lib/media';

interface SponsorsSectionProps {
  content: HomeContent['sponsors'];
}

export default function SponsorsSection({ content }: SponsorsSectionProps) {
  if (content.mode === 'hidden') return null;

  const hasSponsors = content.mode === 'published' && content.tiers.length > 0;

  return (
    <section aria-labelledby="sponsors-heading" className="bg-[#F9FAFB] px-4 py-10 sm:px-6 sm:py-12 lg:px-24">
      <div className="mx-auto max-w-[1248px]">
        <h2 id="sponsors-heading" className="text-center text-[28px] leading-9 text-foreground">
          {content.heading}
        </h2>

        {hasSponsors ? (
          <div className="mt-10 space-y-10">
            {content.tiers.map((tier) => (
              <section
                key={tier.name}
                aria-labelledby={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="space-y-4"
              >
                <h3
                  id={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-center text-label font-bold text-text-secondary"
                >
                  {tier.name}
                </h3>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                  {tier.sponsors.map((sponsor) => {
                    const logo = (
                      <img
                        src={resolveMediaUrl(sponsor.logo)}
                        alt={`${sponsor.name} logo`}
                        className="h-12 w-[225px] max-w-full object-contain"
                        loading="lazy"
                      />
                    );

                    return sponsor.href ? (
                      <a
                        key={sponsor.name}
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex h-[72px] w-full max-w-[289px] items-center justify-center rounded-xl bg-card px-8 py-3 shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        {logo}
                      </a>
                    ) : (
                      <div
                        key={sponsor.name}
                        className="flex h-[72px] w-full max-w-[289px] items-center justify-center rounded-xl bg-card px-8 py-3 shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)]"
                      >
                        {logo}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p role="status" className="mx-auto mt-8 max-w-xl text-center text-lg text-text-secondary">
            {content.placeholderMessage}
          </p>
        )}
      </div>
    </section>
  );
}
