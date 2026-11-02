import type { ReactNode } from 'react';

import PageHero from '@/components/shared/PageHero';
import { resolveMediaUrl } from '@/lib/media';

type ApplyHeroProps = {
  title: string;
  backgroundImage: string;
  children?: ReactNode;
};

function ApplyHero({ title, backgroundImage, children }: ApplyHeroProps) {
  return (
    <PageHero title={title} image={resolveMediaUrl(backgroundImage)} headingId="apply-title">
      {children}
    </PageHero>
  );
}

export default ApplyHero;
