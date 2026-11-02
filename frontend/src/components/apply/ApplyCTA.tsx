import CornerBrackets from '@/components/shared/CornerBrackets';
import {
  darkPrimaryButton,
  darkPrimaryButtonUnavailable,
  darkSecondaryButton,
} from '@/components/shared/buttonStyles';

import ApplyLink from './ApplyLink';

type ApplyCTAProps = {
  heading: string;
  primaryLabel: string;
  primaryHref?: string;
  secondaryLabel: string;
  secondaryHref: string;
};

// The site's closing invitation: navy, framed by the logo's brackets.
function ApplyCTA({ heading, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: ApplyCTAProps) {
  return (
    <section className="bg-h4i-navy px-6 py-20 text-white sm:px-10 lg:px-24 lg:py-28">
      <div className="mx-auto max-w-[1248px]">
        <div className="relative w-fit max-w-full py-5 pr-8 sm:py-6 sm:pr-16">
          <CornerBrackets />
          <h2 className="text-section text-white">{heading}</h2>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
          {primaryHref ? (
            <ApplyLink href={primaryHref} className={darkPrimaryButton}>
              {primaryLabel}
            </ApplyLink>
          ) : (
            <span aria-disabled="true" className={darkPrimaryButtonUnavailable}>
              {primaryLabel}
            </span>
          )}
          <ApplyLink href={secondaryHref} className={darkSecondaryButton}>
            {secondaryLabel}
          </ApplyLink>
        </div>
      </div>
    </section>
  );
}

export default ApplyCTA;
