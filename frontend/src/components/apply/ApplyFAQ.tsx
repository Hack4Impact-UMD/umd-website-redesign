import { ApplySection, SectionHeader } from './ApplyPageLayout';

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
    <ApplySection>
      <div className="space-y-8">
        <SectionHeader title={heading} />
        <div className="w-full">
          {items.map((item) => (
            <details
              key={item.question}
              name="apply-faq"
              className="group border-b border-border"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-7 text-left font-heading text-base font-bold transition-all hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue sm:text-lg [&::-webkit-details-marker]:hidden">
                {item.question}
                <svg
                  aria-hidden="true"
                  className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
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
              <div className="pb-7 font-body text-base leading-6 text-muted-foreground">
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
