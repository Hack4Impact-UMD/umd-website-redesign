import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getHomeContent } from '@/api/content';
import { defaultHomeContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';

export default function CTASection() {
  const homeContent = useApiData(useCallback(() => getHomeContent(), []), defaultHomeContent);
  const cta = homeContent.data.cta;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
          {cta.heading}
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          <Button
            asChild
            className="h-12 px-8 bg-primary hover:bg-state-primary-hover active:bg-state-primary-active text-white font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg shadow-md"
          >
            <Link to={cta.primary.href}>{cta.primary.label}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 px-8 border-2 border-primary text-primary hover:bg-primary/5 font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg"
          >
            <Link to={cta.secondary.href}>{cta.secondary.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
