import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Verified Buyer',
    text: 'Absolutely love the quality of products. The packaging was premium and delivery was super fast. Will definitely shop again!',
    rating: 5,
  },
  {
    name: 'James Wilson',
    role: 'Loyal Customer',
    text: 'Nexus has become my go-to for all premium shopping. The customer service is exceptional and the products never disappoint.',
    rating: 5,
  },
  {
    name: 'Emily Park',
    role: 'Fashion Enthusiast',
    text: 'The curated collection is outstanding. Every piece I\'ve ordered has exceeded my expectations in quality and style.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % testimonials.length), 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20">
      <div className="nexus-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Reviews</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">What Our Customers Say</h2>
        </motion.div>

        <div className="mx-auto max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="rounded-2xl border border-border bg-card p-8 text-center"
            >
              <Quote className="mx-auto mb-4 h-8 w-8 text-gold/30" />
              <p className="text-lg leading-relaxed text-muted-foreground italic">
                "{testimonials[current].text}"
              </p>
              <div className="mt-6 flex justify-center gap-0.5">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 font-display text-lg font-semibold">{testimonials[current].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={() => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrent(p => (p + 1) % testimonials.length)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
