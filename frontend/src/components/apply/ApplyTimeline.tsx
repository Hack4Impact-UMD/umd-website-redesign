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

function ApplyTimeline({ heading, description, steps }: ApplyTimelineProps) {
  return (
    <ApplySection>
      <div className="space-y-10">
        <SectionHeader title={heading} description={description} />
        <ol className="space-y-6">
          {steps.map((step, index) => (
            <li key={`${step.title}-${index}`} className="flex items-start gap-5 sm:items-center sm:gap-10">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-md border border-primary bg-card font-heading text-lg font-bold text-text-secondary shadow-sm sm:h-[72px] sm:w-[72px]">
                {index + 1}
              </div>
              <div className="min-w-0 space-y-2">
                <h3 className="font-heading text-h3 font-bold">{step.title}</h3>
                <p className="font-heading text-label text-text-secondary">{step.subtitle}</p>
                <p className="font-body text-base leading-6 text-foreground sm:text-lg">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </ApplySection>
  );
}

export default ApplyTimeline;
