import { useCallback, useState } from 'react';
import { getHomeContent } from '@/api/content';
import { defaultHomeContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';

import Microsoft from '@/components/assets/supporters/Microsoft.png';
import Uber from '@/components/assets/supporters/Uber.png';
import CodePath from '@/components/assets/supporters/CodePath.png';
import DoGood from '@/components/assets/supporters/DoGood.png';
import CapitalOne from '@/components/assets/supporters/CapitalOne.png';
import SmithSchool from '@/components/assets/supporters/SmithSchool.png';
import Bloomberg from '@/components/assets/supporters/Bloomberg.png';
import ACES from '@/components/assets/supporters/ACES.png';

interface Sponsor {
  name: string;
  logo: string;
}

const sponsorLogoFallbacks: Record<string, string> = {
  Microsoft,
  Uber,
  CodePath,
  'DoGood': DoGood,
  'Capital One': CapitalOne,
  'Smith School': SmithSchool,
  Bloomberg,
  ACES,
};

const resolveSponsorLogo = (sponsor: Sponsor) => {
  const resolved = resolveMediaUrl(sponsor.logo);
  if (resolved && !resolved.includes('/assets/supporters/')) {
    return resolved;
  }

  return sponsorLogoFallbacks[sponsor.name] ?? resolved;
};

function SponsorLogo({ sponsor }: { sponsor: Sponsor }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div className="flex items-center justify-center p-4">
      <img
        src={resolveSponsorLogo(sponsor)}
        alt={`${sponsor.name} logo`}
        className={`max-h-16 md:max-h-20 w-auto object-contain transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
}

export default function SponsorsSection() {
  const homeContent = useApiData(useCallback(() => getHomeContent(), []), defaultHomeContent);
  const sponsors = homeContent.data.sponsors;

  return (
    <section className="py-16 md:py-24 bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            {sponsors.heading}
          </h2>
        </div>

        <div className="space-y-12">
          {sponsors.tiers.map((tier) => (
            <div key={tier.name}>
              <h3 className="text-center font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                {tier.name}
              </h3>
              <div
                className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 ${
                  tier.name === 'Platinum' ? 'gap-12 md:gap-16' : ''
                }`}
              >
                {tier.sponsors.map((sponsor) => (
                  <SponsorLogo key={sponsor.name} sponsor={sponsor} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
