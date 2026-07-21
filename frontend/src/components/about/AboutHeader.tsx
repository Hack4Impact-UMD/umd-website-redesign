import type { AboutContent } from '@/content/about';
import { resolveMediaUrl } from '@/lib/media';

type AboutHeaderProps = AboutContent['header'];

export default function AboutHeader({ title, paragraphs, image, imageAlt }: AboutHeaderProps) {
  const imageSrc = resolveMediaUrl(image);

  return (
    <section aria-labelledby="about-title">
      <div className="relative isolate flex min-h-[160px] items-center justify-center overflow-hidden bg-inverse px-6 py-10 sm:min-h-[208px] sm:px-8 lg:px-24">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-inverse/55" aria-hidden="true" />
        <h1 id="about-title" className="text-center font-heading text-h1 font-bold text-inverse-foreground sm:text-display">
          {title}
        </h1>
      </div>

      <div className="px-6 py-12 sm:px-8 sm:py-16 lg:px-24 lg:py-20">
        <div className="mx-auto max-w-[880px] text-center">
          <div className="space-y-5 font-karla text-body text-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
