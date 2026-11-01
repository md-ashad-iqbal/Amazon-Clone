import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Slide {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  href: string;
}

const SLIDES: Slide[] = [
  {
    id: 'electronics',
    eyebrow: 'Electronics week',
    title: 'Work and play, upgraded',
    description: 'Laptops, monitors and gaming gear from brands you trust.',
    image: 'https://images.pexels.com/photos/2659939/pexels-photo-2659939.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ctaLabel: 'Shop electronics',
    href: '/products?category=electronics',
  },
  {
    id: 'beauty',
    eyebrow: 'Beauty essentials',
    title: 'Your skin, your routine',
    description: 'Serums, mists and moisturisers to keep your glow all day.',
    image: 'https://images.pexels.com/photos/39392892/pexels-photo-39392892.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ctaLabel: 'Shop beauty',
    href: '/products?category=beauty',
  },
  {
    id: 'fashion',
    eyebrow: 'New season edit',
    title: 'Fresh looks for every day',
    description: 'Dresses, shirts and sneakers picked for the season ahead.',
    image: 'https://images.pexels.com/photos/4428388/pexels-photo-4428388.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ctaLabel: 'Shop fashion',
    href: '/products?category=fashion',
  },
  {
    id: 'kitchen',
    eyebrow: 'Home and kitchen',
    title: 'Brew like a barista at home',
    description: 'Pour-over, espresso and siphon sets for slow mornings.',
    image: 'https://images.pexels.com/photos/35240184/pexels-photo-35240184.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ctaLabel: 'Shop kitchen',
    href: '/products?category=home-kitchen',
  },
  {
    id: 'sports',
    eyebrow: 'Fitness',
    title: 'Gear up for every workout',
    description: 'Dumbbells, kettlebells and training kits for home gyms.',
    image: 'https://images.pexels.com/photos/11433027/pexels-photo-11433027.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    ctaLabel: 'Shop sports',
    href: '/products?category=sports',
  },
];

const AUTOPLAY_MS = 5000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, index]);

  const go = (direction: 1 | -1) => {
    setIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="group relative h-[300px] overflow-hidden rounded-2xl bg-navy-900 shadow-card sm:h-[360px] md:h-[420px]"
    >
      {SLIDES.map((slide, slideIndex) => {
        const active = slideIndex === index;
        return (
          <div
            key={slide.id}
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          >
            <img
              src={slide.image}
              alt=""
              loading={slideIndex === 0 ? 'eager' : 'lazy'}
              className={`h-full w-full object-cover transition-transform duration-[6000ms] ease-out ${active ? 'scale-105' : 'scale-100'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-navy-900/10" />
            <div className="absolute inset-0 flex items-center px-6 sm:px-12 md:px-16">
              <div className="max-w-md">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">{slide.eyebrow}</p>
                <h2 className="mt-3 text-3xl font-bold leading-[1.15] text-white md:text-5xl">{slide.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-200 md:text-base">{slide.description}</p>
                <Link to={slide.href} tabIndex={active ? 0 : -1} className="btn-primary mt-6">
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white md:left-5"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-md transition hover:bg-white md:right-5"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setIndex(slideIndex)}
            aria-label={`Show slide ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            className={`h-2 rounded-full transition-all ${slideIndex === index ? 'w-8 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
}
