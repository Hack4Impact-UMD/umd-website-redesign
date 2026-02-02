import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';

import heroImage from '@/components/assets/h4igroup_photo.jpg';
import introImage from '@/components/assets/mott_haven_image.jpg';

const timelineSteps = [
  {
    title: 'Step 1',
    subtitle: 'Dates',
    description:
      'Submit your application so our sourcing team can review your organization’s goals and needs.',
  },
  {
    title: 'Step 2',
    subtitle: 'Dates',
    description:
      'We will reach out within two weeks to schedule a virtual meeting and discuss potential collaboration.',
  },
  {
    title: 'Step 3',
    subtitle: 'Dates',
    description:
      'Confirm the project scope, timeline, and next steps for partnership and onboarding.',
  },
];

const faqItems = [
  {
    question: 'What kinds of projects are a good fit?',
    answer:
      'We build web applications, data tools, and internal systems that help nonprofits scale their impact.',
  },
  {
    question: 'What does a collaboration cost?',
    answer:
      'Projects are free aside from minimal hosting costs, which we keep as low as possible.',
  },
  {
    question: 'How long does a project take?',
    answer:
      'Most engagements span one academic semester (approximately 3–4 months).',
  },
  {
    question: 'How involved should my team be?',
    answer:
      'We ask for regular feedback and a point of contact so we can build the right solution together.',
  },
];

const testimonials = [
  {
    quote:
      'Working with Hack4Impact has been great. The students are talented and really have a passion for social good.',
    name: 'Nonprofit Person',
    organization: 'Organization Name',
  },
  {
    quote:
      'Our collaboration was organized and communicative, and the final product delivered real value.',
    name: 'Nonprofit Person',
    organization: 'Organization Name',
  },
];

function NonprofitApply() {
  return (
    <ApplyPageLayout>
      <ApplyHero title="Apply as a Nonprofit" backgroundImage={heroImage} />
      <div className="bg-accent px-6 py-3 text-center text-sm font-semibold text-primary">
        Currently taking Fall 2025 Applications. Apply Now
      </div>
      <ApplyIntro
        heading="Heading 1"
        body="At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want to use our software and web development skills to help nonprofits. Our collaborations with nonprofits are semester-long (around 3-4 months), and we will work with you to develop a software product that suits your organization's needs."
        ctaLabel="Apply"
        ctaHref="https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link"
        imageSrc={introImage}
        imageAlt="Hack4Impact students collaborating in a classroom"
      />

      <ApplySection variant="muted">
        <div className="space-y-6">
          <SectionHeader title="Criteria/Qualifications" />
          <div className="space-y-4 font-body text-base text-muted-foreground">
            <p>
              At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want
              to use our software and web development skills to help nonprofits. Our collaborations with nonprofits are
              semester-long (around 3-4 months), and we will work with you to develop a software product that suits your
              organization’s needs.
            </p>
            <p>
              At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want
              to use our software and web development skills to help nonprofits. Our collaborations with nonprofits are
              semester-long (around 3-4 months), and we will work with you to develop a software product that suits your
              organization’s needs.
            </p>
          </div>
        </div>
      </ApplySection>

      <ApplyTimeline heading="Application Process & Timeline" steps={timelineSteps} />

      <ApplyTestimonials testimonials={testimonials} />

      <ApplyFaq heading="Frequently Asked Questions" items={faqItems} />

      <ApplyCTA
        heading="Ready to Work with Us?"
        primaryLabel="Apply"
        primaryHref="https://docs.google.com/forms/d/e/1FAIpQLSfaeqcwOGt3QR0h4Lmo-fwW4mA108jpeb0p06upiivwxpDArw/viewform?usp=sf_link"
        secondaryLabel="I'm a Student"
        secondaryHref="/apply/student"
      />
    </ApplyPageLayout>
  );
}

export default NonprofitApply;
