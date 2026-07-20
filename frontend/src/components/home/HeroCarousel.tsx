import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

import type { HomeContent } from '@/content/home';
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
      className="relative mt-6 h-[560px] w-full overflow-hidden md:h-[620px] lg:h-[671px]"
    >
      <div ref={sliderRef} className="keen-slider h-full">
        {content.slides.map((slide, index) => (
          <div key={`${slide.image}-${index}`} className="keen-slider__slide relative">
            <img
              src={resolveMediaUrl(slide.image)}
              alt={slide.alt}
              className={`h-full w-full object-cover ${index === 0 ? 'object-bottom' : 'object-center'}`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/55 to-black/5" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="mx-auto flex h-full max-w-[1440px] flex-col justify-center px-6 pb-24 sm:px-10 lg:px-24">
          <div className="max-w-3xl text-white">
            <h1
              id="home-hero-heading"
              className="font-heading text-4xl font-bold leading-[44px] tracking-tight text-white sm:text-5xl sm:leading-[56px]"
            >
              {content.heading}
            </h1>
            <p className="mt-4 max-w-[813px] font-heading text-base leading-6 text-white sm:text-lg">
              {content.body}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-8">
              <HomeActionLink
                href={content.primaryCta.href}
                className="inline-flex h-11 min-w-[199px] items-center justify-center rounded-lg bg-[#0056A3] px-6 font-heading text-base font-bold text-white transition-colors hover:bg-state-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {content.primaryCta.label}
              </HomeActionLink>
              <HomeActionLink
                href={content.secondaryCta.href}
                className="inline-flex h-11 min-w-[207px] items-center justify-center rounded-lg border border-h4i-blue bg-white px-6 font-heading text-base font-bold text-h4i-blue transition-colors hover:bg-state-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
