import { Button } from '@/components/ui/button';

import ApplyLink from './ApplyLink';
import { ApplySection } from './ApplyPageLayout';

type ApplyCTAProps = {
  heading: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

function ApplyCTA({ heading, primaryLabel, primaryHref, secondaryLabel, secondaryHref }: ApplyCTAProps) {
  return (
    <ApplySection>
      <div className="space-y-6">
        <h2 className="font-heading text-2xl font-bold">{heading}</h2>
        <div className="flex flex-wrap gap-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-[#004785]">
            <ApplyLink href={primaryHref}>{primaryLabel}</ApplyLink>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-accent hover:text-primary"
          >
            <ApplyLink href={secondaryHref}>{secondaryLabel}</ApplyLink>
          </Button>
        </div>
      </div>
    </ApplySection>
  );
}

export default ApplyCTA;
