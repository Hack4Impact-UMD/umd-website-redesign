import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionVariant = 'default' | 'muted' | 'inverse';

type ApplySectionProps = {
  children: ReactNode;
  className?: string;
  variant?: SectionVariant;
};

const sectionVariants: Record<SectionVariant, string> = {
  default: 'bg-background text-foreground',
  muted: 'bg-muted text-foreground',
  inverse: 'bg-inverse text-inverse-foreground',
};

export function ApplyPageLayout({ children }: { children: ReactNode }) {
  return <div className="bg-background text-foreground">{children}</div>;
}

export function ApplySection({ children, className, variant = 'default' }: ApplySectionProps) {
  return (
    <section className={cn('py-16 px-6 lg:px-16', sectionVariants[variant], className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-3xl font-bold tracking-tight">{title}</h2>
      {description ? <p className="font-body text-lg text-muted-foreground">{description}</p> : null}
    </div>
  );
}
