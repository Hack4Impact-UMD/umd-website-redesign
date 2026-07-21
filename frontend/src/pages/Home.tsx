import CTASection from '@/components/home/CTASection';
import HeroCarousel from '@/components/home/HeroCarousel';
import NewsletterSection from '@/components/home/NewsletterSection';
import NonprofitMapSection from '@/components/home/NonprofitMapSection';
import SponsorsSection from '@/components/home/SponsorsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function Home() {
  return (
    <main>
      <HeroCarousel />
      <NonprofitMapSection />
      <TestimonialsSection />
      <NewsletterSection />
      <SponsorsSection />
      <CTASection />
    </main>
  );
}
