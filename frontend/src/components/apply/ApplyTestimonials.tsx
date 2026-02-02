import { ApplySection } from './ApplyPageLayout';

type Testimonial = {
  quote: string;
  name: string;
  organization: string;
};

type ApplyTestimonialsProps = {
  testimonials: Testimonial[];
};

function ApplyTestimonials({ testimonials }: ApplyTestimonialsProps) {
  return (
    <ApplySection variant="inverse">
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.name}
            className="space-y-4 rounded-2xl bg-card px-6 py-6 text-foreground shadow-sm"
          >
            <span className="text-4xl font-bold text-muted-foreground">“</span>
            <p className="font-body text-sm text-muted-foreground">{testimonial.quote}</p>
            <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
            <div className="text-xs text-muted-foreground">{testimonial.organization}</div>
          </div>
        ))}
      </div>
    </ApplySection>
  );
}

export default ApplyTestimonials;
