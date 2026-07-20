import type { HomeContent } from '@/content/home';
import HomeActionLink from './HomeActionLink';

interface NewsletterSectionProps {
  content: HomeContent['newsletter'];
}

export default function NewsletterSection({ content }: NewsletterSectionProps) {
  if (content.mode === 'hidden') return null;

  const latestIssue = content.mode === 'externalLink' ? content.latestIssue : undefined;
  const subscribeUrl = content.mode === 'externalLink' ? content.subscribeUrl : undefined;

  return (
    <section aria-labelledby="newsletter-heading" className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-24 lg:py-0">
      <div className="mx-auto grid max-w-[1248px] items-center gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-[88px]">
        <div>
          <h2 id="newsletter-heading" className="text-[28px] leading-9 text-foreground">
            {content.heading}
          </h2>
          <p className="mt-3 text-lg leading-6 text-text-secondary">{content.body}</p>

          {(content.mode !== 'externalLink' || subscribeUrl) && (
            <div className="mt-10 max-w-[302px]">
              <h3 className="text-[22px] leading-[30px] text-text-secondary">
                {content.subscribeHeading}
              </h3>

              {content.mode === 'externalLink' && subscribeUrl ? (
                <div className="mt-3 space-y-3">
                  <a
                    href={subscribeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                  >
                    {content.linkLabel ?? 'Subscribe'}
                  </a>
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
          )}

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

        <div className="relative flex h-[430px] items-center justify-center overflow-hidden bg-[#D1D5DB] p-6 sm:h-[560px] sm:p-12 lg:h-[758px]">
          {latestIssue ? (
            <article className="w-full max-w-[520px] overflow-hidden rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <header className="bg-[#0056A3] px-6 py-5 text-white sm:px-8 sm:py-7">
                {latestIssue.dateLabel && (
                  <p className="font-heading text-sm leading-5 text-white/80">{latestIssue.dateLabel}</p>
                )}
                <p className="mt-2 font-heading text-base font-bold leading-5 text-white">
                  {latestIssue.sender}
                </p>
                <h3 className="mt-3 text-[22px] leading-[30px] text-white">{latestIssue.title}</h3>
              </header>
              <div className="space-y-6 px-6 py-7 sm:px-8 sm:py-9">
                <p className="text-lg leading-6 text-text-secondary">{latestIssue.summary}</p>
                {latestIssue.href && (
                  <HomeActionLink
                    href={latestIssue.href}
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-h4i-blue bg-white px-6 font-heading text-base font-bold text-h4i-blue transition-colors hover:bg-state-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
                  >
                    Read the Latest Issue
                  </HomeActionLink>
                )}
              </div>
            </article>
          ) : (
            <div className="relative h-[72%] w-full max-w-[560px]" aria-hidden="true">
              <div className="absolute right-0 top-0 h-[70%] w-[70%] rounded-lg bg-white/75 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <div className="h-16 rounded-t-lg bg-[#0056A3]/30" />
                <div className="space-y-4 p-6">
                  <div className="h-3 w-2/3 rounded-full bg-slate-300" />
                  <div className="h-3 w-full rounded-full bg-slate-200" />
                  <div className="h-3 w-4/5 rounded-full bg-slate-200" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-[58%] w-[62%] rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                <div className="h-12 rounded-t-lg bg-[#0056A3]/70" />
                <div className="grid grid-cols-2 gap-3 p-5">
                  <div className="h-20 rounded bg-slate-200" />
                  <div className="h-20 rounded bg-slate-100" />
                  <div className="col-span-2 h-3 rounded-full bg-slate-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
