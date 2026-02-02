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
        <ol className="space-y-8">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-primary text-sm font-bold text-primary">
                {index + 1}
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{step.title}</p>
                <h3 className="font-heading text-lg font-bold">{step.subtitle}</h3>
                <p className="font-body text-sm text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </ApplySection>
  );
}

export default ApplyTimeline;
