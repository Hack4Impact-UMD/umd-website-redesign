import type { ApplicationStatus } from '@/content/apply';

import ApplyLink from './ApplyLink';

type ApplicationStatusBannerProps = {
  status: ApplicationStatus;
  overrideText?: string;
};

function ApplicationStatusBanner({ status, overrideText }: ApplicationStatusBannerProps) {
  const label = overrideText?.trim() || status.label;

  return (
    <div
      className="border-y border-primary/15 bg-accent px-6 py-3 text-center font-heading text-sm font-bold text-primary"
      role="status"
    >
      <span>{label}</span>
      {status.state === 'open' ? (
        <>
          {' '}
          <ApplyLink href={status.applicationUrl} className="underline underline-offset-4 hover:text-state-primary-hover">
            Apply now
          </ApplyLink>
        </>
      ) : null}
    </div>
  );
}

export default ApplicationStatusBanner;
