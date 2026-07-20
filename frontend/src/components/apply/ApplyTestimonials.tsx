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
  if (testimonials.length === 0) return null;

  return (
    <ApplySection className="bg-h4i-blue text-white">
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <div
            key={`${testimonial.name}-${testimonial.organization}-${index}`}
            className="space-y-4 rounded-lg bg-card px-6 py-6 text-foreground shadow-sm"
          >
            <span className="text-4xl font-bold text-muted-foreground">“</span>
            <blockquote className="font-body text-base leading-6 text-foreground">“{testimonial.quote}”</blockquote>
            <div className="text-sm font-semibold text-foreground">{testimonial.name}</div>
            <div className="text-xs text-muted-foreground">{testimonial.organization}</div>
          </div>
        ))}
      </div>
    </ApplySection>
  );
}

export default ApplyTestimonials;
