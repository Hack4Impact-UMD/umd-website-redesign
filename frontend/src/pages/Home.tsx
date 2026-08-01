import { getContentDocument } from '@/api/content';
import CTASection from '@/components/home/CTASection';
import CommunityEventsSection from '@/components/home/CommunityEventsSection';
import HeroCarousel from '@/components/home/HeroCarousel';
import ImpactSection from '@/components/home/ImpactSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import NonprofitMapSection from '@/components/home/NonprofitMapSection';
import SponsorsSection from '@/components/home/SponsorsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import { defaultHomeContent, normalizeHomeContent } from '@/content/home';
import { useApiResource } from '@/hooks';

const loadHomeContent = (signal: AbortSignal) => getContentDocument('home', signal);

export default function Home() {
  const { data, status } = useApiResource(loadHomeContent);
  const resolved = status === 'success' ? normalizeHomeContent(data) : null;
  const content = resolved?.source === 'hidden' ? null : (resolved?.content ?? defaultHomeContent);

  if (!content) {
    return <main aria-label="Home" />;
  }

  return (
    <main className="bg-background">
      {status === 'loading' && <p className="sr-only" role="status">Loading current home content.</p>}
      {status === 'error' && (
        <p className="sr-only" role="status">
          Current home content is unavailable. Showing the verified site fallback.
        </p>
      )}
      <HeroCarousel content={content.hero} />
      <ImpactSection content={content.impact} />
      <NonprofitMapSection content={content.nonprofitMap} />
      <TestimonialsSection content={content.testimonials} />
      <CommunityEventsSection />
      <NewsletterSection content={content.newsletter} />
      <SponsorsSection content={content.sponsors} />
      <CTASection content={content.cta} />
    </main>
  );
}
