import { ApplySection, SectionHeader } from './ApplyPageLayout';

type TimelineStep = {
  title: string;
  subtitle: string;
  description: string;
};

type ApplyTimelineProps = {
  heading: string;
  description?: string;
  steps: TimelineStep[];
};

// A real sequence, so it stays an ordered list with its step labels.
function ApplyTimeline({ heading, description, steps }: ApplyTimelineProps) {
  return (
    <ApplySection>
      <SectionHeader title={heading} description={description} />
      <ol className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className="border-t-2 border-h4i-blue pt-5">
            <p className="font-heading text-label text-h4i-blue">{step.title}</p>
            <h3 className="mt-2 font-heading text-2xl font-normal leading-tight tracking-tight text-foreground">
              {step.subtitle}
            </h3>
            <p className="mt-3 font-body text-base leading-relaxed text-text-secondary sm:text-lg">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </ApplySection>
  );
}

export default ApplyTimeline;
