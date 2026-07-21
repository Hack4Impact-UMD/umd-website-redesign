import { getContentDocument } from '@/api/content';
import AsyncError from '@/components/shared/AsyncError';
import CTASection from '@/components/home/CTASection';
import HeroCarousel from '@/components/home/HeroCarousel';
import NewsletterSection from '@/components/home/NewsletterSection';
import NonprofitMapSection from '@/components/home/NonprofitMapSection';
import SponsorsSection from '@/components/home/SponsorsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { defaultHomeContent, normalizeHomeContent } from '@/content/home';
import { useApiResource } from '@/hooks';

const loadHomeContent = (signal: AbortSignal) => getContentDocument('home', signal);

export default function Home() {
  const { data, status, retry } = useApiResource(loadHomeContent);
  const resolved = status === 'success' ? normalizeHomeContent(data) : null;
  const content = resolved?.source === 'hidden' ? null : (resolved?.content ?? defaultHomeContent);

  if (!content) {
    return <main aria-label="Home" />;
  }

  return (
    <main className="bg-background">
      {status === 'loading' && <p className="sr-only" role="status">Loading current home content.</p>}
      {status === 'error' && (
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <AsyncError
            message="Current home content is unavailable. Showing the verified site fallback."
            onRetry={retry}
          />
        </div>
      )}
      <HeroCarousel content={content.hero} />
      <NonprofitMapSection content={content.nonprofitMap} />
      <TestimonialsSection content={content.testimonials} />
      <NewsletterSection content={content.newsletter} />
      <SponsorsSection content={content.sponsors} />
      <CTASection content={content.cta} />
    </main>
  );
}
