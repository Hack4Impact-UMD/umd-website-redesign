import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const heroSlides = [
  {
    image: '/src/components/assets/h4igroup_photo.jpg',
    alt: 'Hack4Impact UMD team photo',
  },
  {
    image: '/src/components/assets/aboutus_header.png',
    alt: 'Hack4Impact UMD event',
  },
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

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

        function clearNextTimeout() {
          clearTimeout(timeout);
        }

        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, 5000);
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ]
  );

  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <div ref={sliderRef} className="keen-slider h-full">
        {heroSlides.map((slide, index) => (
          <div key={index} className="keen-slider__slide relative">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <h1 className="text-display text-white mb-4">
              Hack4Impact-UMD
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Building powerful nonprofit software as a tool for social good. We connect student
              developers with nonprofits to create technology that drives positive change.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-primary hover:bg-state-primary-hover active:bg-state-primary-active text-white px-8 py-6 text-base font-medium rounded-md"
              >
                <Link to="/aboutus">Learn More</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white bg-transparent hover:bg-white/10 text-white px-8 py-6 text-base font-medium rounded-md"
              >
                <Link to="/apply/student">Apply Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {loaded && instanceRef.current && (
        <div className="absolute bottom-8 left-4 sm:left-8 flex items-center gap-2">
          <button
            onClick={() => instanceRef.current?.prev()}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="ml-4 flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === idx ? 'bg-white' : 'bg-white/40'
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
