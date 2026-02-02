import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

type ApplyLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

function ApplyLink({ href, children, className }: ApplyLinkProps) {
  const isExternal = href.startsWith('http');

  if (isExternal) {
    return (
      <a href={href} className={cn(className)} target="_blank" rel="noreferrer">
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
