import { cn } from '@/lib/utils';

type ApplyHeroProps = {
  title: string;
  backgroundImage: string;
  className?: string;
};

function ApplyHero({ title, backgroundImage, className }: ApplyHeroProps) {
  return (
    <section className={cn('relative h-[240px] sm:h-[280px] lg:h-[320px]', className)}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-inverse-foreground sm:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default ApplyHero;
