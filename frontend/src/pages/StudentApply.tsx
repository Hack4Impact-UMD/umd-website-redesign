import { useCallback } from 'react';
import {
  Brush,
  ClipboardList,
  Code2,
  GraduationCap,
  Search,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';
import RoleCard from '@/components/apply/RoleCard';

import { getApplyStudentContent } from '@/api/content';
import { defaultApplyStudentContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import heroImageFallback from '@/components/assets/h4igroup_photo.jpg';
import introImageFallback from '@/components/assets/mott_haven_image.jpg';

const roleIconMap: Record<string, LucideIcon> = {
  Code2,
  Brush,
  Wrench,
  Search,
  ClipboardList,
  GraduationCap,
};

function StudentApply() {
  const studentContent = useApiData(
    useCallback(() => getApplyStudentContent(), []),
    defaultApplyStudentContent,
  );

  const content = studentContent.data;

  return (
    <ApplyPageLayout>
      <ApplyHero
        title={content.hero.title}
        backgroundImage={resolveMediaUrl(content.hero.image) || heroImageFallback}
      />
      <ApplyIntro
        heading={content.intro.heading}
        body={content.intro.body}
        ctaLabel={content.intro.ctaLabel}
        ctaHref={content.intro.ctaHref}
        imageSrc={resolveMediaUrl(content.intro.image) || introImageFallback}
        imageAlt={content.intro.imageAlt}
      />

      <ApplySection>
        <div className="space-y-8">
          <SectionHeader title="Roles" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {content.roles.map((role) => {
              const icon = roleIconMap[role.icon] ?? Code2;
              return <RoleCard key={role.title} title={role.title} description={role.description} icon={icon} />;
            })}
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

export default StudentApply;
