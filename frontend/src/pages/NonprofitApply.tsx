import { useCallback } from 'react';
import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';

import { getApplyNonprofitContent } from '@/api/content';
import { defaultApplyNonprofitContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import heroImageFallback from '@/components/assets/h4igroup_photo.jpg';
import introImageFallback from '@/components/assets/mott_haven_image.jpg';

function NonprofitApply() {
  const nonprofitContent = useApiData(
    useCallback(() => getApplyNonprofitContent(), []),
    defaultApplyNonprofitContent,
  );

  const content = nonprofitContent.data;

  return (
    <ApplyPageLayout>
      <ApplyHero
        title={content.hero.title}
        backgroundImage={resolveMediaUrl(content.hero.image) || heroImageFallback}
      />
      {content.banner?.enabled ? (
        <div className="bg-accent px-6 py-3 text-center text-sm font-semibold text-primary">
          {content.banner.text}
        </div>
      ) : null}
      <ApplyIntro
        heading={content.intro.heading}
        body={content.intro.body}
        ctaLabel={content.intro.ctaLabel}
        ctaHref={content.intro.ctaHref}
        imageSrc={resolveMediaUrl(content.intro.image) || introImageFallback}
        imageAlt={content.intro.imageAlt}
      />

      <ApplySection variant="muted">
        <div className="space-y-6">
          <SectionHeader title={content.criteria.heading} />
          <div className="space-y-4 font-body text-base text-muted-foreground">
            {content.criteria.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </ApplySection>

      <ApplyTimeline
        heading={content.timeline.heading}
        description={content.timeline.description}
        steps={content.timeline.steps}
      />

      <ApplyTestimonials testimonials={content.testimonials} />

      <ApplyFaq heading={content.faq.heading} items={content.faq.items} />

      <ApplyCTA
        heading={content.cta.heading}
        primaryLabel={content.cta.primaryLabel}
        primaryHref={content.cta.primaryHref}
        secondaryLabel={content.cta.secondaryLabel}
        secondaryHref={content.cta.secondaryHref}
      />
    </ApplyPageLayout>
  );
}

export default NonprofitApply;
