import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { isSafeCtaUrl } from '@/lib/urls';

interface HomeActionLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export default function HomeActionLink({ href, className, children }: HomeActionLinkProps) {
  if (!isSafeCtaUrl(href)) {
    return (
      <span className={className} aria-disabled="true">
        {children}
      </span>
    );
  }

  if (href.startsWith('/')) {
    return (
      <Link to={href} className={className}>
        {children}
      </Link>
    );
  }

  const opensNewTab = href.startsWith('https:');
  return (
    <a
      href={href}
      className={className}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noreferrer' : undefined}
    >
      {children}
    </a>
  );
}
