import { getContentDocument } from '@/api/content';
import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplicationStatusBanner from '@/components/apply/ApplicationStatusBanner';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';
import ContentNotice from '@/components/shared/ContentNotice';
import { normalizeApplyNonprofitContent } from '@/content/apply';
import { useApiResource } from '@/hooks';

const placeholder = normalizeApplyNonprofitContent(null);

const loadNonprofitContent = async (signal: AbortSignal) =>
  normalizeApplyNonprofitContent(await getContentDocument('apply/nonprofit', signal));

function NonprofitApply() {
  const resource = useApiResource(loadNonprofitContent);
  const resolved = resource.data ?? placeholder;
  const content = resolved.content;

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

      {resource.error ? (
        <div className="mx-auto max-w-[1248px] px-6 pt-8 lg:px-24">
          <ContentNotice>
            We could not refresh the latest application details. Applications are currently closed.
          </ContentNotice>
        </div>
      ) : null}

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
          <div className="space-y-6">
            <SectionHeader title={content.criteria.heading} />
            <div className="space-y-4 font-body text-base leading-6 text-foreground sm:text-lg">
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

export default NonprofitApply;
