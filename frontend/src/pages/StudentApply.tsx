import {
  Brush,
  ClipboardList,
  Code2,
  GraduationCap,
  Search,
  Wrench,
} from 'lucide-react';

import ApplyCTA from '@/components/apply/ApplyCTA';
import ApplyFaq from '@/components/apply/ApplyFAQ';
import ApplyHero from '@/components/apply/ApplyHero';
import ApplyIntro from '@/components/apply/ApplyIntro';
import { ApplyPageLayout, ApplySection, SectionHeader } from '@/components/apply/ApplyPageLayout';
import ApplyTestimonials from '@/components/apply/ApplyTestimonials';
import ApplyTimeline from '@/components/apply/ApplyTimeline';
import RoleCard from '@/components/apply/RoleCard';

import heroImage from '@/components/assets/h4igroup_photo.jpg';
import introImage from '@/components/assets/mott_haven_image.jpg';

const roles = [
  {
    title: 'Engineer',
    description:
      'Build and ship product features while pairing with designers and product managers on each sprint.',
    icon: Code2,
  },
  {
    title: 'Designer',
    description: 'Translate nonprofit needs into elegant UX flows, wireframes, and visual systems.',
    icon: Brush,
  },
  {
    title: 'Tech Lead',
    description: 'Guide technical direction, architecture decisions, and mentorship for the engineering team.',
    icon: Wrench,
  },
  {
    title: 'Sourcing',
    description: 'Identify and onboard nonprofit partners while managing outreach and relationship building.',
    icon: Search,
  },
  {
    title: 'Product Manager',
    description: 'Scope the roadmap, plan sprints, and keep teams aligned on impact-driven outcomes.',
    icon: ClipboardList,
  },
  {
    title: 'Bootcamp',
    description: 'Learn foundational web development and prep to join a project team next semester.',
    icon: GraduationCap,
  },
];

const timelineSteps = [
  {
    title: 'Step 1',
    subtitle: 'Dates',
    description:
      'Submit the online application so our sourcing team can review your goals and interests.',
  },
  {
    title: 'Step 2',
    subtitle: 'Dates',
    description:
      'Selected applicants meet with a board member to discuss fit, expectations, and team placement.',
  },
  {
    title: 'Step 3',
    subtitle: 'Dates',
    description:
      'Receive your decision and onboarding details so you can start building with your team.',
  },
];

const faqItems = [
  {
    question: 'What is the weekly time commitment?',
    answer: 'Most members spend 3–5 hours per week, including a team sync and async project work.',
  },
  {
    question: 'Do I need prior technical experience?',
    answer:
      'No. We welcome all skill levels and place newer developers in Bootcamp to build confidence.',
  },
  {
    question: 'Which tech stack do teams use?',
    answer:
      'Most teams work in React, Node.js, and modern cloud tools, but we adapt to project needs.',
  },
  {
    question: 'Can I apply for multiple roles?',
    answer:
      'Yes. Share your interests in the application and we will help identify the best fit.',
  },
];

const testimonials = [
  {
    quote:
      'Hack4Impact helped me grow as a developer while working on a mission-driven product with an amazing team.',
    name: 'Student Member',
    organization: 'Hack4Impact-UMD',
  },
  {
    quote:
      'I loved collaborating with designers and PMs to deliver real impact for a local nonprofit.',
    name: 'Student Lead',
    organization: 'Hack4Impact-UMD',
  },
];

function StudentApply() {
  return (
    <ApplyPageLayout>
      <ApplyHero title="Apply as a Student" backgroundImage={heroImage} />
      <ApplyIntro
        heading="Heading 1"
        body="At Hack4Impact, we understand that nonprofit organizations are a valuable asset to our community. We want to use our software and web development skills to help nonprofits. Our collaborations with nonprofits are semester-long (around 3-4 months), and we will work with you to develop a software product that suits your organization's needs."
        ctaLabel="Apply"
        ctaHref="https://apply.umd.hack4impact.org/login"
        imageSrc={introImage}
        imageAlt="Hack4Impact students collaborating in a classroom"
      />

      <ApplySection>
        <div className="space-y-8">
          <SectionHeader title="Roles" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <RoleCard key={role.title} {...role} />
            ))}
          </div>
        </div>
      </ApplySection>

      <ApplyTimeline heading="Application Process & Timeline" steps={timelineSteps} />

      <ApplyTestimonials testimonials={testimonials} />

      <ApplyFaq heading="Frequently Asked Questions" items={faqItems} />

      <ApplyCTA
        heading="Ready to Work with Us?"
        primaryLabel="Apply"
        primaryHref="https://apply.umd.hack4impact.org/login"
        secondaryLabel="View Projects"
        secondaryHref="/ourwork"
      />
    </ApplyPageLayout>
  );
}

export default StudentApply;
