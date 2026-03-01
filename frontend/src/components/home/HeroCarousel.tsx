import { useCallback, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getHomeContent } from '@/api/content';
import { defaultHomeContent } from '@/api/defaultContent';
import { useApiData } from '@/hooks/useApiData';
import { resolveMediaUrl } from '@/lib/media';
import h4iGroupPhoto from '@/components/assets/h4igroup_photo.jpg';
import aboutHeader from '@/components/assets/aboutus_header.png';

const localSlideFallbacks = [h4iGroupPhoto, aboutHeader];

const getSlideImage = (image: string | undefined, index: number) => {
  const resolved = resolveMediaUrl(image);
  if (resolved && !resolved.includes('/assets/')) {
    return resolved;
  }

  return localSlideFallbacks[index % localSlideFallbacks.length];
};

export default function HeroCarousel() {
  const homeContent = useApiData(useCallback(() => getHomeContent(), []), defaultHomeContent);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const hero = homeContent.data.hero;
  const heroSlides = hero.slides?.length > 0 ? hero.slides : defaultHomeContent.hero.slides;

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      loop: true,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        const clearNextTimeout = () => {
          clearTimeout(timeout);
        };

        const nextTimeout = () => {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        };

        const handleMouseOver = () => {
          mouseOver = true;
          clearNextTimeout();
        };

        const handleMouseOut = () => {
          mouseOver = false;
          nextTimeout();
        };

        const handleCreated = () => {
          slider.container.addEventListener('mouseover', handleMouseOver);
          slider.container.addEventListener('mouseout', handleMouseOut);
          nextTimeout();
        };

        const handleDragStarted = () => {
          clearNextTimeout();
        };

        const handleAnimationEnded = () => {
          nextTimeout();
        };

        const handleUpdated = () => {
          nextTimeout();
        };

        const removeSliderListener = (
          event: 'created' | 'dragStarted' | 'animationEnded' | 'updated',
          handler: () => void,
        ) => {
          (slider as unknown as { off?: (event: string, handler: () => void) => void }).off?.(
            event,
            handler,
          );
        };

        slider.on('created', handleCreated);
        slider.on('dragStarted', handleDragStarted);
        slider.on('animationEnded', handleAnimationEnded);
        slider.on('updated', handleUpdated);

        return () => {
          clearNextTimeout();
          slider.container.removeEventListener('mouseover', handleMouseOver);
          slider.container.removeEventListener('mouseout', handleMouseOut);
          removeSliderListener('created', handleCreated);
          removeSliderListener('dragStarted', handleDragStarted);
          removeSliderListener('animationEnded', handleAnimationEnded);
          removeSliderListener('updated', handleUpdated);
        };
      },
    ],
  );

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-full">
        {heroSlides.map((slide, index) => (
          <div key={`${slide.alt}-${index}`} className="keen-slider__slide relative">
            <img
              src={getSlideImage(slide.image, index)}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl text-center md:text-left animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-display font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              {hero.heading}
            </h1>
            <p className="font-body text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-md mx-auto md:mx-0 drop-shadow-md">
              {hero.body}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                asChild
                className="h-12 px-8 bg-h4i-blue hover:bg-state-primary-hover active:bg-state-primary-active text-white text-base font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Link to={hero.primaryCta.href}>{hero.primaryCta.label}</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-8 border-2 border-white bg-white text-foreground hover:bg-white/90 text-base font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Link to={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loaded && instanceRef.current && (
        <div className="absolute bottom-6 left-4 sm:left-8 flex items-center">
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full p-1">
            <button
              onClick={() => instanceRef.current?.prev()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => instanceRef.current?.next()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="ml-4 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  currentSlide === idx
                    ? 'bg-white scale-110'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
