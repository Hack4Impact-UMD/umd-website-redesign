import { ApplySection } from './ApplyPageLayout';

type FaqItem = {
  question: string;
  answer: string;
};

type ApplyFaqProps = {
  heading: string;
  items: FaqItem[];
};

/**
 * Native <details> rather than a Radix accordion.
 *
 * The apply pages are otherwise entirely static, and this was the only reason
 * they would have needed a hydrated island. <details> gives the same
 * open/close behaviour with no JavaScript, and a shared `name` keeps the
 * one-at-a-time behaviour the Radix version had via type="single".
 */
function ApplyFaq({ heading, items }: ApplyFaqProps) {
  if (items.length === 0) return null;

  return (
    <ApplySection variant="muted">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <h2 className="text-section lg:col-span-4">{heading}</h2>
        <div className="border-t border-black/10 lg:col-span-8">
          {items.map((item) => (
            <details key={item.question} name="apply-faq" className="group border-b border-black/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left font-heading text-xl font-normal leading-snug tracking-tight text-foreground transition-colors hover:text-h4i-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue sm:text-2xl [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  aria-hidden="true"
                  className="h-5 w-5 shrink-0 text-h4i-blue transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="max-w-prose pb-6 font-body text-lg leading-relaxed text-text-secondary">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </ApplySection>
  );
}

export default ApplyFaq;
