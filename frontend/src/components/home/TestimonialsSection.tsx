import { Quote } from 'lucide-react';

import testimonialBackground from '@/components/assets/home/testimonials.webp';
import type { HomeContent } from '@/content/home';

interface TestimonialsSectionProps {
  content: HomeContent['testimonials'];
}

export default function TestimonialsSection({ content }: TestimonialsSectionProps) {
  if (content.mode === 'hidden') return null;

  const hasTestimonials = content.mode === 'published' && content.items.length > 0;

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative overflow-hidden px-4 py-20 sm:px-6 md:py-24 lg:min-h-[569px] lg:px-24"
    >
      <img
        src={testimonialBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-[#2B2F32]/55" />

      <div className="relative mx-auto max-w-[1248px]">
        <h2 id="testimonials-heading" className="text-center text-[28px] leading-9 text-white">
          {content.heading}
        </h2>

        {hasTestimonials ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:items-start lg:gap-[54px]">
            {content.items.slice(0, 3).map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${testimonial.organization}`}
                className={`rounded-xl bg-white p-6 shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)] ${
                  index !== 1 ? 'md:mt-8' : ''
                }`}
              >
                <Quote className="h-10 w-10 text-h4i-blue" aria-hidden="true" />
                <blockquote className="mt-4 text-lg leading-6 text-foreground">
                  “{testimonial.quote}”
                </blockquote>
                <footer className="mt-4 font-heading text-base font-bold leading-5">
                  <p className="text-base font-bold leading-5 text-foreground">{testimonial.name}</p>
                  <p className="mt-1 text-base font-bold leading-5 text-muted-foreground">
                    {testimonial.organization}
                  </p>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div
            role="status"
            className="mx-auto mt-10 max-w-xl rounded-xl bg-white p-8 text-center shadow-[0_1px_2px_1px_rgba(0,0,0,0.1)]"
          >
            <Quote className="mx-auto h-10 w-10 text-h4i-blue" aria-hidden="true" />
            <p className="mt-4 text-lg leading-6 text-foreground">{content.placeholderMessage}</p>
          </div>
        )}
      </div>
    </section>
  );
}
