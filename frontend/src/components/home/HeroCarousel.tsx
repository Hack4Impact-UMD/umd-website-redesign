import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import type { HomeContent } from '@/content-schema/home';
import { resolveMediaUrl } from '@/lib/media';
import HomeActionLink from './HomeActionLink';

interface HeroCarouselProps {
  content: HomeContent['hero'];
}

export default function HeroCarousel({ content }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ready, setReady] = useState(false);
  const hasMultipleSlides = content.slides.length > 1;

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
            <div className="relative py-5 sm:py-6">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -left-3 top-0 h-7 w-7 border-l-[2.5px] border-t-[2.5px] border-white/80 sm:-left-6 sm:h-11 sm:w-11 sm:border-l-[3px] sm:border-t-[3px]"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-3 bottom-0 h-7 w-7 border-b-[2.5px] border-r-[2.5px] border-white/80 sm:right-2 sm:h-11 sm:w-11 sm:border-b-[3px] sm:border-r-[3px]"
              />
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
              <HomeActionLink
                href={content.primaryCta.href}
                className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-lg bg-white px-6 font-heading text-base font-bold text-h4i-blue transition-colors hover:bg-state-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-h4i-navy"
              >
                {content.primaryCta.label}
              </HomeActionLink>
              <HomeActionLink
                href={content.secondaryCta.href}
                className="inline-flex h-11 min-w-[200px] items-center justify-center rounded-lg border-2 border-white/80 bg-transparent px-6 font-heading text-base font-bold text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-h4i-navy"
              >
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
