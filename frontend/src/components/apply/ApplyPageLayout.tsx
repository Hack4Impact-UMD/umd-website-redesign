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
  return <main className="bg-background text-foreground">{children}</main>;
}

export function ApplySection({ children, className, variant = 'default' }: ApplySectionProps) {
  return (
    <section className={cn('px-6 py-16 lg:px-24', sectionVariants[variant], className)}>
      <div className="mx-auto w-full max-w-[1248px]">{children}</div>
    </section>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="space-y-3">
      <h2 className="font-heading text-h2 font-bold tracking-tight">{title}</h2>
      {description ? <p className="font-body text-lg text-muted-foreground">{description}</p> : null}
    </div>
  );
}
