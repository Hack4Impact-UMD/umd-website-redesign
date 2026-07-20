import type { HomeContent } from '@/content/home';
import { resolveMediaUrl } from '@/lib/media';

interface SponsorsSectionProps {
  content: HomeContent['sponsors'];
}

export default function SponsorsSection({ content }: SponsorsSectionProps) {
  if (content.mode === 'hidden') return null;

  const hasSponsors = content.mode === 'published' && content.tiers.length > 0;

  return (
    <section aria-labelledby="sponsors-heading" className="bg-[#F9FAFB] px-4 py-12 sm:px-6 lg:px-24">
      <div className="mx-auto max-w-[1248px]">
        <h2 id="sponsors-heading" className="text-center text-[28px] leading-9 text-foreground">
          {content.heading}
        </h2>

        {hasSponsors ? (
          <div className="mt-10 space-y-12">
            {content.tiers.map((tier) => (
              <section key={tier.name} aria-labelledby={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <h3
                  id={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-center text-[22px] leading-[30px] text-text-secondary"
                >
                  {tier.name}
                </h3>
                <div className="mt-6 grid grid-cols-1 items-center justify-items-center gap-10 sm:grid-cols-2 sm:gap-x-24">
                  {tier.sponsors.map((sponsor) => {
                    const logo = (
                      <img
                        src={resolveMediaUrl(sponsor.logo)}
                        alt={`${sponsor.name} logo`}
                        className="max-h-20 w-full max-w-[280px] object-contain"
                        loading="lazy"
                      />
                    );

                    return sponsor.href ? (
                      <a
                        key={sponsor.name}
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex min-h-24 w-full items-center justify-center rounded-lg p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        {logo}
                      </a>
                    ) : (
                      <div key={sponsor.name} className="flex min-h-24 w-full items-center justify-center p-4">
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
