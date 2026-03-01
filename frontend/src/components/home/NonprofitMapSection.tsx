import { useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { getHomeContent } from '@/api/content';
import { defaultHomeContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';

export default function NonprofitMapSection() {
  const homeContent = useApiData(useCallback(() => getHomeContent(), []), defaultHomeContent);
  const mapSection = homeContent.data.nonprofitMap;

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-h2 text-foreground mb-4">{mapSection.heading}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {mapSection.body}
          </p>
        </div>

        <div className="relative bg-muted rounded-2xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 250 Q 200 100 400 250 T 700 250"
                stroke="currentColor"
                strokeWidth="2"
                className="text-h4i-blue"
              />
              <circle cx="200" cy="200" r="8" className="fill-h4i-blue" />
              <circle cx="400" cy="280" r="8" className="fill-h4i-blue" />
              <circle cx="550" cy="220" r="8" className="fill-h4i-blue" />
              <circle cx="650" cy="300" r="8" className="fill-h4i-blue" />
            </svg>
          </div>

          <div className="relative z-10 text-center p-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-h4i-blue/10 mb-4">
              <MapPin className="w-8 h-8 text-h4i-blue" />
            </div>
            <h3 className="text-h3 text-foreground mb-2">{mapSection.statusTitle}</h3>
            <p className="text-muted-foreground max-w-md">{mapSection.statusDescription}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
