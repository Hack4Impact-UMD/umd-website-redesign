import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection } from '@/components/apply/ApplyPageLayout';
import ApplicationStatusBanner from '@/components/apply/ApplicationStatusBanner';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';
import ContentNotice from '@/components/shared/ContentNotice';
import { normalizeApplyNonprofitContent } from '@/content-schema/apply';

type NonprofitApplyContent = ReturnType<typeof normalizeApplyNonprofitContent>['content'];

interface NonprofitApplySectionsProps {
  content: NonprofitApplyContent;
}

export default function NonprofitApplySections({ content }: NonprofitApplySectionsProps) {
  if (!content) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-[1248px] px-6 py-16 lg:px-24">
        <ContentNotice>The nonprofit application page is not currently available.</ContentNotice>
      </main>
    );
  }

  const applicationHref =
    content.applicationStatus.state === 'open' ? content.applicationStatus.applicationUrl : undefined;
  const applicationLabel =
    content.applicationStatus.state === 'open'
      ? content.intro.ctaLabel
      : content.applicationStatus.state === 'comingSoon'
        ? 'Applications coming soon'
        : 'Applications closed';

  return (
    <ApplyPageLayout>
      <ApplyHero title={content.hero.title} backgroundImage={content.hero.image} />
      <ApplicationStatusBanner
        status={content.applicationStatus}
        overrideText={content.banner?.enabled ? content.banner.text : undefined}
      />

      <ApplyIntro
        heading={content.intro.heading}
        body={content.intro.body}
        ctaLabel={applicationLabel}
        ctaHref={applicationHref}
        imageSrc={content.intro.image}
        imageAlt={content.intro.imageAlt}
      />

      {content.criteria.paragraphs.length > 0 ? (
        <ApplySection variant="muted">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="text-section lg:col-span-4">
              {/* Allow a break after slashes: CMS headings like "Criteria/Qualifications" are one unbreakable word. */}
              {content.criteria.heading.replaceAll('/', '/\u200B')}
            </h2>
            <div className="space-y-5 font-body text-lg leading-relaxed text-text-secondary lg:col-span-8">
              {content.criteria.paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 40)}-${index}`}>{paragraph}</p>
              ))}
            </div>
          </div>
        </ApplySection>
      ) : null}

      {content.timeline.steps.length > 0 ? (
        <ApplyTimeline
          heading={content.timeline.heading}
          description={content.timeline.description}
          steps={content.timeline.steps}
        />
      ) : null}

      <ApplyTestimonials testimonials={content.testimonials} />
      <ApplyFaq heading={content.faq.heading} items={content.faq.items} />

      <ApplyCTA
        heading={content.cta.heading}
        primaryLabel={applicationLabel}
        primaryHref={applicationHref}
        secondaryLabel={content.cta.secondaryLabel}
        secondaryHref={content.cta.secondaryHref}
      />
    </ApplyPageLayout>
  );
}

