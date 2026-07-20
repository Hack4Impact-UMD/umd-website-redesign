import { Button } from '@/components/ui/button';
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
    <ApplySection className="py-12 sm:py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-10">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight">{heading}</h2>
            <p className="font-body text-lg text-muted-foreground">{body}</p>
          </div>
          {ctaHref ? (
            <Button asChild className="w-fit min-w-24 bg-primary text-primary-foreground hover:bg-state-primary-hover">
              <ApplyLink href={ctaHref}>{ctaLabel}</ApplyLink>
            </Button>
          ) : (
            <Button className="w-fit min-w-24" disabled>
              {ctaLabel}
            </Button>
          )}
        </div>
        {imageUrl ? <div className="flex justify-center lg:justify-end">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="aspect-[604/252] w-full rounded-lg object-cover"
            loading="lazy"
          />
        </div> : null}
      </div>
    </ApplySection>
  );
}

export default ApplyIntro;
