import { Button } from '@/components/ui/button';

import ApplyLink from './ApplyLink';
import { ApplySection } from './ApplyPageLayout';

type ApplyIntroProps = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt: string;
};

function ApplyIntro({ heading, body, ctaLabel, ctaHref, imageSrc, imageAlt }: ApplyIntroProps) {
  return (
    <ApplySection>
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight">{heading}</h2>
            <p className="font-body text-lg text-muted-foreground">{body}</p>
          </div>
          <Button asChild className="w-fit bg-primary text-primary-foreground hover:bg-[#004785]">
            <ApplyLink href={ctaHref}>{ctaLabel}</ApplyLink>
          </Button>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-[520px] rounded-2xl object-cover shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </ApplySection>
  );
}

export default ApplyIntro;
