import type { ReactNode } from 'react';

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
