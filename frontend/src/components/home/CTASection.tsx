import type { HomeContent } from '@/content-schema/home';
import CornerBrackets from './CornerBrackets';
import { darkPrimaryButton, darkSecondaryButton } from './darkButtons';
import HomeActionLink from './HomeActionLink';

interface CTASectionProps {
  content: HomeContent['cta'];
}

// Bookends the hero: same navy, brackets and button pair, so the page opens and
// closes on the same invitation.
export default function CTASection({ content }: CTASectionProps) {
  return (
    <section
      aria-labelledby="home-cta-heading"
      className="bg-h4i-navy px-6 py-20 text-white sm:px-10 lg:px-24 lg:py-28"
    >
      <div className="mx-auto max-w-[1248px]">
        <div className="max-w-3xl">
          <div className="relative w-fit py-5 pr-8 sm:py-6 sm:pr-16">
            <CornerBrackets />
            <h2 id="home-cta-heading" className="text-section text-white">
              {content.heading}
            </h2>
          </div>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
            <HomeActionLink href={content.primary.href} className={darkPrimaryButton}>
              {content.primary.label}
            </HomeActionLink>
            <HomeActionLink href={content.secondary.href} className={darkSecondaryButton}>
              {content.secondary.label}
            </HomeActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}
