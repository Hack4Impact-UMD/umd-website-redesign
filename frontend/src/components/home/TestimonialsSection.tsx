import { useCallback } from 'react';
import { getHomeContent } from '@/api/content';
import { defaultHomeContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 28c-2.2 0-4-1.8-4-4v-2c0-5.5 4.5-10 10-10h1v4h-1c-3.3 0-6 2.7-6 6h4c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4h-4zm20 0c-2.2 0-4-1.8-4-4v-2c0-5.5 4.5-10 10-10h1v4h-1c-3.3 0-6 2.7-6 6h4c2.2 0 4 1.8 4 4v2c0 2.2-1.8 4-4 4h-4z" />
    </svg>
  );
}

export default function TestimonialsSection() {
  const homeContent = useApiData(useCallback(() => getHomeContent(), []), defaultHomeContent);
  const testimonials = homeContent.data.testimonials;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-[#0F172A]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1e293b] to-[#0F172A] opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-h4i-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-h4i-mint/5 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
            {testimonials.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.items.map((testimonial, index) => (
            <article
              key={`${testimonial.name}-${index}`}
              className="group relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="relative h-full p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]">
                <QuoteIcon className="absolute -top-2 -left-1 w-16 h-16 text-h4i-blue/20 transition-colors duration-300 group-hover:text-h4i-blue/30" />

                <blockquote className="relative z-10">
                  <p className="font-body text-base md:text-lg text-white/90 leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </p>

                  <footer className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-h4i-blue/30 to-h4i-mint/30 flex items-center justify-center">
                      <span className="text-white/80 text-sm font-medium">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <cite className="not-italic">
                        <span className="block font-heading font-bold text-white text-sm">
                          {testimonial.name}
                        </span>
                        <span className="block font-body text-white/50 text-sm">
                          {testimonial.organization}
                        </span>
                      </cite>
                    </div>
                  </footer>
                </blockquote>

                <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-h4i-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
