import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media';

type ApplyHeroProps = {
  title: string;
  backgroundImage: string;
  className?: string;
};

function ApplyHero({ title, backgroundImage, className }: ApplyHeroProps) {
  const imageUrl = resolveMediaUrl(backgroundImage);

  return (
    <section className={cn('relative h-[180px] overflow-hidden bg-inverse sm:h-[228px]', className)}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-hidden="true"
        />
      ) : null}
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-inverse-foreground sm:text-5xl">
          {title}
        </h1>
      </div>
    </section>
  );
}

export default ApplyHero;
