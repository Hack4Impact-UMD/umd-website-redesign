import type { AboutContent } from '@/content/about';
import { resolveMediaUrl } from '@/lib/media';

type AboutHeaderProps = AboutContent['header'];

export default function AboutHeader({ title, paragraphs, image, imageAlt }: AboutHeaderProps) {
  const imageSrc = resolveMediaUrl(image);

  return (
    <section className="px-6 py-10 sm:px-8 lg:px-24" aria-labelledby="about-title">
      <div className="mx-auto max-w-[1248px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,599px)_minmax(0,1fr)] lg:gap-20">
          <div>
            <h1 id="about-title" className="mb-2 font-heading text-h1 font-bold text-foreground">
              {title}
            </h1>
            <div className="space-y-4 font-karla text-body text-foreground">
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt}
              className="aspect-[569/387] w-full rounded-lg object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
