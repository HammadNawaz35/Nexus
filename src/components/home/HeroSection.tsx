import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroBanner1 from '@/assets/hero-banner-1.jpg';
import heroBanner2 from '@/assets/hero-banner-2.jpg';
import heroBanner3 from '@/assets/hero-banner-3.jpg';

const slides = [
  {
    image: heroBanner1,
    title: 'Spring Collection',
    titleAccent: '2026',
    subtitle: 'UP TO 70% OFF',
    description: 'Explore premium products curated for the modern lifestyle. Limited time offer.',
    link: '/products',
    cta: 'Shop Now',
  },
  {
    image: heroBanner2,
    title: 'Flash',
    titleAccent: 'Sale',
    subtitle: 'ELECTRONICS & GADGETS',
    description: 'Massive discounts on top-tier electronics. Don\'t miss out.',
    link: '/category/electronics',
    cta: 'View Deals',
  },
  {
    image: heroBanner3,
    title: 'New',
    titleAccent: 'Arrivals',
    subtitle: 'BEAUTY & LIFESTYLE',
    description: 'Be the first to discover this season\'s finest pieces.',
    link: '/category/beauty',
    cta: 'Explore',
  },
];

const sidebarCards = [
  { icon: Truck, title: 'Free Shipping', desc: 'Orders over PKR 5,000', gradient: 'from-emerald-500/10 to-emerald-600/5' },
  { icon: ShieldCheck, title: 'Secure Payment', desc: '100% Protected', gradient: 'from-blue-500/10 to-blue-600/5' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day guarantee', gradient: 'from-amber-500/10 to-amber-600/5' },
  { icon: Headphones, title: '24/7 Support', desc: 'Always here for you', gradient: 'from-purple-500/10 to-purple-600/5' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(p => (p + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(p => (p - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0, scale: 1.1 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-30%' : '30%', opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="nexus-container py-4 sm:py-6">
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        {/* Main Slider */}
        <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/20 aspect-[4/3] sm:aspect-[2/1] lg:aspect-[2.4/1]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {/* Image with Ken Burns effect */}
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="h-full w-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: 1.08 }}
                transition={{ duration: 8, ease: 'linear' }}
              />

              {/* Premium gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              {/* Decorative elements */}
              <div className="absolute right-12 top-8 hidden h-20 w-20 rounded-full border border-gold/20 md:block" />
              <div className="absolute right-20 top-16 hidden h-12 w-12 rounded-full border border-gold/10 md:block" />
              <div className="absolute bottom-8 right-16 hidden md:block">
                <div className="h-px w-32 bg-gradient-to-r from-gold/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full p-4 sm:p-10 md:p-14 lg:max-w-[65%]">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                    className="mb-2 inline-block rounded-full border border-gold/30 bg-gold/10 px-3 py-0.5 backdrop-blur-sm sm:mb-3 sm:px-4 sm:py-1"
                  >
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold">
                      {slide.subtitle}
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.6 }}
                    className="font-display text-2xl font-bold leading-[1.1] text-white sm:text-4xl md:text-5xl lg:text-7xl"
                  >
                    {slide.title}{' '}
                    <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                      {slide.titleAccent}
                    </span>
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="mt-2 max-w-md text-xs text-white/70 sm:text-sm md:text-base"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.5 }}
                    className="mt-4 flex flex-wrap gap-2 sm:gap-3"
                  >
                    <Button variant="gold" size="sm" asChild className="group shadow-lg shadow-gold/25 sm:size-default">
                      <Link to={slide.link}>
                        {slide.cta}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="border-white/20 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:size-default"
                    >
                      <Link to="/products">Browse All</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-10 flex gap-1 px-4 pb-3">
            {slides.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/20">
                {i === current && (
                  <motion.div
                    className="h-full bg-gold"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                  />
                )}
                {i < current && <div className="h-full w-full bg-gold/60" />}
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:border-gold hover:bg-black/50 sm:left-4 sm:h-10 sm:w-10"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-all hover:border-gold hover:bg-black/50 sm:right-4 sm:h-10 sm:w-10"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>

        {/* Sidebar */}
        <div className="hidden flex-col gap-3 lg:flex">
          {sidebarCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
              className={`group flex flex-1 cursor-pointer items-center gap-3 rounded-xl border border-border bg-gradient-to-br ${card.gradient} p-4 transition-all hover:border-gold/40 hover:shadow-lg hover:shadow-gold/5`}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-background/80 transition-colors group-hover:bg-gold/10">
                <card.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{card.title}</p>
                <p className="text-[11px] text-muted-foreground">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Trust Badges */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:hidden">
        {sidebarCards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="flex items-center gap-2 rounded-lg border border-border bg-card p-3"
          >
            <card.icon className="h-4 w-4 flex-shrink-0 text-gold" />
            <span className="text-[11px] font-medium leading-tight">{card.title}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
