import {
  BookOpen,
  Brush,
  ClipboardPen,
  Code2,
  Search,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplicationStatusBanner from '@/components/apply/ApplicationStatusBanner';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';
import RoleCard from '@/components/apply/RoleCard';
import ContentNotice from '@/components/shared/ContentNotice';
import { normalizeApplyStudentContent } from '@/content-schema/apply';

const roleIcons: Record<string, LucideIcon> = {
  engineer: Code2,
  designer: Brush,
  'tech-lead': Wrench,
  techlead: Wrench,
  sourcing: Search,
  'product-manager': ClipboardPen,
  productmanager: ClipboardPen,
  bootcamp: BookOpen,
};

type StudentApplyContent = ReturnType<typeof normalizeApplyStudentContent>['content'];

interface StudentApplySectionsProps {
  content: StudentApplyContent;
  /** Evaluated at build time by the page; see _StudentApplyPage.astro. */
  applicationIsOpen: boolean;
}

export default function StudentApplySections({
  content,
  applicationIsOpen,
}: StudentApplySectionsProps) {
  if (!content) {
    return (
      <main className="mx-auto min-h-[50vh] max-w-[1248px] px-6 py-16 lg:px-24">
        <ContentNotice>The student application page is not currently available.</ContentNotice>
      </main>
    );
  }

  const applicationHref = applicationIsOpen ? content.applicationStatus.applicationUrl : undefined;
  const applicationLabel =
    applicationIsOpen
      ? content.intro.ctaLabel
      : content.applicationStatus.state === 'comingSoon'
        ? 'Applications coming soon'
        : 'Applications closed';
  const applicationStatusText =
    applicationIsOpen
      ? undefined
      : content.applicationStatus.state === 'comingSoon'
        ? 'Applications coming soon'
        : 'Applications are currently closed. Check back for the next application cycle.';

  return (
    <ApplyPageLayout>
      <ApplyHero title={content.hero.title} backgroundImage={content.hero.image} />
      <ApplicationStatusBanner
        status={applicationIsOpen ? content.applicationStatus : { ...content.applicationStatus, state: 'closed' }}
        overrideText={applicationStatusText}
      />


      <ApplyIntro
        heading={content.intro.heading}
        body={content.intro.body}
        ctaLabel={applicationLabel}
        ctaHref={applicationHref}
        imageSrc={content.intro.image}
        imageAlt={content.intro.imageAlt}
      />

      {content.roles.length > 0 ? (
        <ApplySection variant="muted">
          <div className="space-y-8">
            <SectionHeader title="Roles" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.roles.map((role) => (
                <RoleCard
                  key={role.title}
                  title={role.title}
                  description={role.description}
                  icon={roleIcons[role.icon.toLowerCase()] ?? Code2}
                />
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

