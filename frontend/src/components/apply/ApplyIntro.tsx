import { lightPrimaryButton, lightPrimaryButtonUnavailable } from '@/components/shared/buttonStyles';
import { resolveMediaUrl } from '@/lib/media';

import ApplyLink from './ApplyLink';
import { ApplySection } from './ApplyPageLayout';

type ApplyIntroProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref?: string;
  imageSrc: string;
  imageAlt: string;
};

function ApplyIntro({ heading, body, ctaLabel, ctaHref, imageSrc, imageAlt }: ApplyIntroProps) {
  const imageUrl = resolveMediaUrl(imageSrc);

  return (
    <ApplySection>
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 className="text-section">{heading}</h2>
          <p className="mt-4 max-w-prose font-body text-lg leading-relaxed text-text-secondary">{body}</p>
          <div className="mt-8">
            {ctaHref ? (
              <ApplyLink href={ctaHref} className={lightPrimaryButton}>
                {ctaLabel}
              </ApplyLink>
            ) : (
              <span aria-disabled="true" className={lightPrimaryButtonUnavailable}>
                {ctaLabel}
              </span>
            )}
          </div>
        </div>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={imageAlt}
            className="aspect-[4/3] w-full rounded-lg object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
    </ApplySection>
  );
}

export default ApplyIntro;
