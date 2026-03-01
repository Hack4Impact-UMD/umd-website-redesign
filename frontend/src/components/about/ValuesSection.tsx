import { useCallback } from 'react';
import { getAboutContent } from '@/api/content';
import { defaultAboutContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import teamPhoto from '@/components/assets/h4igroup_photo.jpg';

export default function ValuesSection() {
  const aboutContent = useApiData(useCallback(() => getAboutContent(), []), defaultAboutContent);
  const values = aboutContent.data.values;

  return (
    <section className="py-16 px-6 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-3xl font-bold text-foreground text-center mb-12">
          {values.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.items.map((value) => (
            <div key={value.title}>
              <img
                src={resolveMediaUrl(value.image) || teamPhoto}
                alt={value.imageAlt || value.title}
                className="w-full aspect-[4/3] object-cover rounded-xl"
              />
              <h3 className="font-heading text-xl font-bold text-foreground mt-4">
                {value.title}
              </h3>
              <p className="font-body text-base text-muted-foreground mt-2 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
