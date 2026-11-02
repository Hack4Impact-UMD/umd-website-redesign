import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import type { HomeContent } from '@/content-schema/home';
import { resolveMediaUrl } from '@/lib/media';
import { APPLICATION_CLOSES_AT_MS } from '@/content-schema/apply';
import CornerBrackets from './CornerBrackets';
import { darkPrimaryButton, darkSecondaryButton } from './darkButtons';
import HomeActionLink from './HomeActionLink';

interface HeroCarouselProps {
  content: HomeContent['hero'];
  /** Whether the CMS marked student applications open at build time. */
  studentApplicationsOpen?: boolean;
}

export default function HeroCarousel({ content, studentApplicationsOpen = false }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const hasMultipleSlides = content.slides.length > 1;
  // A static build can outlive the deadline, so re-check the hard close on load.
  const [applicationsOpen, setApplicationsOpen] = useState(studentApplicationsOpen);
  useEffect(() => {
    if (Date.now() >= APPLICATION_CLOSES_AT_MS) setApplicationsOpen(false);
  }, []);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: hasMultipleSlides,
    slideChanged: (slider) => setCurrentSlide(slider.track.details.rel),
    created: () => setReady(true),
  });

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="relative h-[628px] w-full overflow-hidden md:h-[688px] lg:h-[831px]"
    >
      <div ref={sliderRef} className="keen-slider h-full">
        {content.slides.map((slide, index) => (
          <div key={`${slide.image}-${index}`} className="keen-slider__slide relative">
            <picture className="block h-full w-full">
              {slide.mobileImage && (
                <source media="(max-width: 639px)" srcSet={resolveMediaUrl(slide.mobileImage)} />
              )}
              <img
                src={resolveMediaUrl(slide.image)}
                alt={slide.alt}
                className="h-full w-full object-cover object-center"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </picture>
            {/* Below md the copy spans the full width, so a side-fading gradient leaves its right half on bare photo. */}
            <div className="absolute inset-0 bg-h4i-navy/70 md:bg-transparent md:bg-gradient-to-r md:from-h4i-navy/90 md:from-15% md:via-h4i-navy/65 md:via-45% md:to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-h4i-navy/30 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 pb-16 pt-[68px] sm:px-10 lg:px-24">
          <div className="max-w-3xl text-white">
            {applicationsOpen && (
              <a
                href="/apply/student"
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-1.5 font-body text-sm text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Student applications are open
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </a>
            )}
            <div className="relative py-5 sm:py-6">
              <CornerBrackets />
              <h1
                id="home-hero-heading"
                className="text-balance font-heading text-4xl font-normal leading-[1.05] tracking-tight text-white sm:-ml-1 sm:text-7xl"
              >
                {content.heading}
              </h1>
              <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-white [text-shadow:0_1px_12px_rgb(0_0_0/0.5)] sm:text-xl">
                {content.body}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
              <HomeActionLink href={content.primaryCta.href} className={darkPrimaryButton}>
                {content.primaryCta.label}
              </HomeActionLink>
              <HomeActionLink href={content.secondaryCta.href} className={darkSecondaryButton}>
                {content.secondaryCta.label}
              </HomeActionLink>
            </div>
          </div>

          {ready && hasMultipleSlides && (
            <div className="absolute bottom-8 flex items-center gap-4">
              <button
                type="button"
                onClick={() => instanceRef.current?.prev()}
                className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/30 text-white transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Previous hero image"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => instanceRef.current?.next()}
                className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/30 text-white transition-colors hover:bg-white/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Next hero image"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <span className="sr-only" aria-live="polite">
                Image {currentSlide + 1} of {content.slides.length}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
