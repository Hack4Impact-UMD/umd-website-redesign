import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Projects from '@/components/projects/Projects';
import { getAboutContent } from '@/api/content';
import { defaultAboutContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';

export default function CurrentProjectsSection() {
  const aboutContent = useApiData(useCallback(() => getAboutContent(), []), defaultAboutContent);
  const section = aboutContent.data.currentProjects;

  return (
    <section className="py-16 px-6 lg:px-16 bg-inverse">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-3xl font-bold text-inverse-foreground">
            {section.heading}
          </h2>
          <Link
            to={section.linkHref}
            className="font-body text-inverse-foreground hover:text-inverse-foreground/80 transition-colors"
          >
            {section.linkLabel}
          </Link>
        </div>
        <div className="[&_h3]:text-inverse-foreground [&_p]:text-inverse-foreground/80 [&_a]:text-inverse-foreground [&_h1]:text-inverse-foreground">
          <Projects
            isFeatured={false}
            showSectionTitle={false}
            containerClassName="!mx-0 !max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
