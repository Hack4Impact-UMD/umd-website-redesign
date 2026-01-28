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
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(heroSlides.length).fill(false));

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

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
          <div key={index} className="keen-slider__slide relative bg-gray-200">
            <img
              src={slide.image}
              alt={slide.alt}
              className={`w-full h-full object-cover transition-opacity duration-700 ${
                imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => handleImageLoad(index)}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl text-center md:text-left animate-fade-in-up">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-display font-bold text-white mb-4 tracking-tight drop-shadow-lg">
              Hack4Impact-UMD
            </h1>
            <p className="font-body text-base md:text-lg text-white/90 mb-8 leading-relaxed max-w-md mx-auto md:mx-0 drop-shadow-md">
              Building powerful nonprofit software as a tool for social good. We connect student
              developers with nonprofits to create technology that drives positive change.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button
                asChild
                className="h-12 px-8 bg-h4i-blue hover:bg-state-primary-hover active:bg-state-primary-active text-white text-base font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Link to="/aboutus">Learn More</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 px-8 border-2 border-white bg-white text-foreground hover:bg-white/90 text-base font-medium rounded-md transition-all hover:scale-105 hover:shadow-lg shadow-md"
              >
                <Link to="/apply/student">Apply Now</Link>
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
