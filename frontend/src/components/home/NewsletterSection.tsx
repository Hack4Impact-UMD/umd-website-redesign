import newsletterBack from '@/components/assets/home/newsletter-back.png';
import newsletterFront from '@/components/assets/home/newsletter-front.png';
import type { HomeContent } from '@/content/home';

interface NewsletterSectionProps {
  content: HomeContent['newsletter'];
}

export default function NewsletterSection({ content }: NewsletterSectionProps) {
  if (content.mode === 'hidden') return null;

  return (
    <section aria-labelledby="newsletter-heading" className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-24 lg:py-0">
      <div className="mx-auto grid max-w-[1248px] items-center gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[88px]">
        <div>
          <h2 id="newsletter-heading" className="text-[28px] leading-9 text-foreground">
            {content.heading}
          </h2>
          <p className="mt-3 text-lg leading-6 text-text-secondary">{content.body}</p>

          <div className="mt-10 max-w-[302px]">
            <h3 className="text-[22px] leading-[30px] text-text-secondary">
              {content.subscribeHeading}
            </h3>

            {content.mode === 'externalLink' ? (
              <div className="mt-3 space-y-3">
                {content.subscribeUrl && (
                  <a
                    href={content.subscribeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                  >
                    {content.linkLabel ?? 'Subscribe'}
                  </a>
                )}
                {content.latestIssue?.href && (
                  <a
                    href={content.latestIssue.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-h4i-blue bg-white px-6 font-heading text-base font-bold text-h4i-blue transition-colors hover:bg-state-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                  >
                    Read the Latest Issue
                  </a>
                )}
              </div>
            ) : (
              <p
                role="status"
                className="mt-3 rounded-md border border-input bg-white px-4 py-3 text-base leading-5 text-muted-foreground"
              >
                {content.placeholderMessage}
              </p>
            )}
          </div>

          {content.stats.length > 0 && (
            <dl className="mt-8 grid grid-cols-2 gap-4">
              {content.stats.map((stat) => (
                <div key={`${stat.value}-${stat.label}`}>
                  <dt className="text-sm text-muted-foreground">{stat.label}</dt>
                  <dd className="font-heading text-2xl font-bold text-h4i-blue">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="relative h-[430px] overflow-hidden bg-[#D1D5DB] sm:h-[560px] lg:h-[758px]">
          <img
            src={newsletterBack}
            alt=""
            className="absolute right-[7%] top-[10%] w-[60%] select-none object-contain opacity-65 blur-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            loading="lazy"
          />
          <img
            src={newsletterFront}
            alt=""
            className="absolute bottom-[8%] left-[8%] w-[48%] select-none object-contain opacity-65 blur-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 px-6 text-center">
            <p className="rounded-lg bg-white/95 px-5 py-3 font-heading text-base font-bold text-text-secondary shadow-md">
              Verified newsletter preview coming soon
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
