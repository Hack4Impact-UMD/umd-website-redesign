import type { HomeContent } from '@/content/home';
import { resolveMediaUrl } from '@/lib/media';

interface SponsorsSectionProps {
  content: HomeContent['sponsors'];
}

const logoSizeClass = (sponsorName: string) => {
  if (sponsorName === 'CodePath' || sponsorName === 'Bloomberg') {
    return 'max-h-12 max-w-[240px]';
  }

  if (sponsorName === 'Microsoft' || sponsorName === 'Capital One' || sponsorName === 'Robert H. Smith School of Business') {
    return 'max-h-14 max-w-[210px]';
  }

  return 'max-h-16 max-w-[128px]';
};

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
          <div className="mt-10 space-y-12">
            {content.tiers.map((tier) => (
              <section
                key={tier.name}
                aria-labelledby={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="space-y-6"
              >
                <h3
                  id={`sponsor-tier-${tier.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-center gap-4 text-label font-bold text-h4i-blue before:h-px before:flex-1 before:bg-h4i-blue/35 after:h-px after:flex-1 after:bg-h4i-blue/35"
                >
                  <span>{tier.name}</span>
                </h3>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-12 sm:gap-y-8">
                  {tier.sponsors.map((sponsor) => {
                    const logo = (
                      <img
                        src={resolveMediaUrl(sponsor.logo)}
                        alt={`${sponsor.name} logo`}
                        className={`h-auto w-auto object-contain ${logoSizeClass(sponsor.name)}`}
                        loading="lazy"
                      />
                    );

                    return sponsor.href ? (
                      <a
                        key={sponsor.name}
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex h-24 w-full max-w-[240px] items-center justify-center px-4 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                        aria-label={`Visit ${sponsor.name}`}
                      >
                        {logo}
                      </a>
                    ) : (
                      <div
                        key={sponsor.name}
                        className="flex h-24 w-full max-w-[240px] items-center justify-center px-4"
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
