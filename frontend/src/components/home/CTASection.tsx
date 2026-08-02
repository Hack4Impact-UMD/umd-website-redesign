import type { HomeContent } from '@/content/home';
import HomeActionLink from './HomeActionLink';

interface CTASectionProps {
  content: HomeContent['cta'];
}

export default function CTASection({ content }: CTASectionProps) {
  return (
    <section aria-labelledby="home-cta-heading" className="bg-white px-4 py-10 sm:px-6 lg:px-24">
      <div className="mx-auto max-w-[1248px]">
        <h2 id="home-cta-heading" className="text-[28px] leading-9 text-foreground">
          {content.heading}
        </h2>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-9">
          <HomeActionLink
            href={content.primary.href}
            className="inline-flex h-10 min-w-[199px] items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            {content.primary.label}
          </HomeActionLink>
          <HomeActionLink
            href={content.secondary.href}
            className="inline-flex h-10 min-w-[207px] items-center justify-center rounded-lg border border-h4i-blue bg-white px-6 font-heading text-base font-bold text-h4i-blue transition-colors hover:bg-state-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
          >
            {content.secondary.label}
          </HomeActionLink>
        </div>
      </div>
    </section>
  );
}
