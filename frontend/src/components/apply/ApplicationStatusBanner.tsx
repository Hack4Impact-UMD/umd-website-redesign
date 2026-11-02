import type { ApplicationStatus } from '@/content-schema/apply';

import ApplyLink from './ApplyLink';

type ApplicationStatusBannerProps = {
  status: ApplicationStatus;
  overrideText?: string;
};

/** Full-width application status strip, directly under the page hero. */
function ApplicationStatusBanner({ status, overrideText }: ApplicationStatusBannerProps) {
  const label = overrideText?.trim() || status.label;
  const isOpen = status.state === 'open';

  return (
    <div
      className={`border-b px-6 py-4 sm:px-10 lg:px-24 ${
        isOpen ? 'border-h4i-blue/20 bg-[#E7EFF8]' : 'border-black/5 bg-[#F1F3F5]'
      }`}
      role="status"
    >
      <p className="mx-auto flex max-w-[1248px] items-start gap-3 font-body text-base leading-6 text-foreground">
        <span
          aria-hidden="true"
          className={`mt-2 h-2 w-2 shrink-0 rounded-full ${isOpen ? 'bg-h4i-blue' : 'bg-text-secondary/50'}`}
        />
        <span>
          {label}
          {isOpen ? (
            <>
              {' '}
              <ApplyLink
                href={status.applicationUrl}
                className="ml-1 rounded-sm font-heading font-bold text-h4i-blue underline underline-offset-4 hover:text-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h4i-blue focus-visible:ring-offset-2"
              >
                Apply now
              </ApplyLink>
            </>
          ) : null}
        </span>
      </p>
    </div>
  );
}

export default ApplicationStatusBanner;
