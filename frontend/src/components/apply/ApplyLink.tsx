import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { isSafeCtaUrl } from '@/lib/urls';

type ApplyLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function ApplyLink({ href, children, className }: ApplyLinkProps) {
  if (!isSafeCtaUrl(href)) {
    return (
      <span className={cn(className)} aria-disabled="true">
        {children}
      </span>
    );
  }

  const opensNewTab = href.startsWith('https:');

  return (
    <a
      href={href}
      className={cn(className)}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}

export default ApplyLink;
