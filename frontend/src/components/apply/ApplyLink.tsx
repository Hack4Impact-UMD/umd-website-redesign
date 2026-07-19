import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

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

  const isExternal = href.startsWith('https:') || href.startsWith('mailto:');

  if (isExternal) {
    return (
      <a
        href={href}
        className={cn(className)}
        target={href.startsWith('https:') ? '_blank' : undefined}
        rel={href.startsWith('https:') ? 'noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <Link to={href} className={cn(className)}>
      {children}
    </Link>
  );
}

export default ApplyLink;
