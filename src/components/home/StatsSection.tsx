import { motion, useInView } from 'framer-motion';
import { ShoppingBag, Users, Star, Award } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { icon: ShoppingBag, value: 50000, suffix: '+', label: 'Products Sold', format: 'k' },
  { icon: Users, value: 25000, suffix: '+', label: 'Happy Customers', format: 'k' },
  { icon: Star, value: 4.9, suffix: '', label: 'Average Rating', format: 'decimal' },
  { icon: Award, value: 150, suffix: '+', label: 'Premium Brands', format: 'number' },
];

function AnimatedNumber({ value, suffix, format, inView }: { value: number; suffix: string; format: string; inView: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(value, increment * step);
      setDisplay(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, value]);

  const formatted = format === 'k'
    ? `${Math.floor(display / 1000)}K`
    : format === 'decimal'
    ? display.toFixed(1)
    : Math.floor(display).toString();

  return <>{formatted}{suffix}</>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-16" ref={ref}>
      <div className="nexus-container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                <stat.icon className="h-6 w-6 text-gold" />
              </div>
              <span className="font-display text-3xl font-bold">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} format={stat.format} inView={inView} />
              </span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
