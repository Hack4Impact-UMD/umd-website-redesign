import { useCallback } from 'react';
import { getAboutContent } from '@/api/content';
import { defaultAboutContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import teamPhoto from '@/components/assets/h4igroup_photo.jpg';

export default function AboutHeader() {
  const aboutContent = useApiData(useCallback(() => getAboutContent(), []), defaultAboutContent);
  const header = aboutContent.data.header;
  const headerImage = resolveMediaUrl(header.image);

  return (
    <section className="py-12 lg:py-20 px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-6">
              {header.title}
            </h1>
            <div className="space-y-4 font-body text-lg text-muted-foreground leading-relaxed">
              {header.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div>
            <img
              src={headerImage || teamPhoto}
              alt={header.imageAlt}
              className="w-full rounded-2xl object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
