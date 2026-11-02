import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type SectionVariant = 'default' | 'muted' | 'inverse';

type ApplySectionProps = {
  children: ReactNode;
  className?: string;
  variant?: SectionVariant;
};

// The same white / cool grey / navy rhythm as the home and about pages.
const sectionVariants: Record<SectionVariant, string> = {
  default: 'bg-white text-foreground',
  muted: 'bg-[#F1F3F5] text-foreground',
  inverse: 'bg-h4i-navy text-white',
};

export function ApplyPageLayout({ children }: { children: ReactNode }) {
  return <main className="bg-white text-foreground">{children}</main>;
}

export function ApplySection({ children, className, variant = 'default' }: ApplySectionProps) {
  return (
    <section className={cn('px-6 py-16 sm:px-8 lg:px-24 lg:py-24', sectionVariants[variant], className)}>
      <div className="mx-auto w-full max-w-[1248px]">{children}</div>
    </section>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-section">{title}</h2>
      {description ? (
        <p className="mt-4 font-body text-lg leading-relaxed text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}
