import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

// Flash sale ends in 6 hours from first load
const FLASH_SALE_DURATION = 6 * 60 * 60; // seconds

function useCountdown() {
  const [endTime] = useState(() => {
    const saved = localStorage.getItem('nexus-flash-end');
    if (saved && Number(saved) > Date.now()) return Number(saved);
    const end = Date.now() + FLASH_SALE_DURATION * 1000;
    localStorage.setItem('nexus-flash-end', String(end));
    return end;
  });

  const calcRemaining = useCallback(() => Math.max(0, Math.floor((endTime - Date.now()) / 1000)), [endTime]);
  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, [calcRemaining]);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return { hours, minutes, seconds, isExpired: remaining <= 0 };
}

function TimerBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive text-lg font-bold text-destructive-foreground sm:h-14 sm:w-14 sm:text-xl">
        {String(value).padStart(2, '0')}
      </div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export default function FlashSaleSection() {
  const { data: products, isLoading } = useProducts();
  const { addToCart } = useStore();
  const { hours, minutes, seconds, isExpired } = useCountdown();

  // Pick products with discounts for flash sale
  const flashItems = products?.filter(p => p.discount && p.discount > 0).slice(0, 6) || [];

  if (isExpired || isLoading || flashItems.length === 0) return null;

  return (
    <section className="py-12">
      <div className="nexus-container">
        <div className="rounded-2xl border border-destructive/20 bg-card p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <Zap className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-bold sm:text-3xl">Flash Sale</h2>
                <p className="text-sm text-muted-foreground">On Sale Now — Limited Time!</p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Ends in</span>
              <TimerBox value={hours} label="hrs" />
              <span className="text-lg font-bold text-muted-foreground">:</span>
              <TimerBox value={minutes} label="min" />
              <span className="text-lg font-bold text-muted-foreground">:</span>
              <TimerBox value={seconds} label="sec" />
            </div>
          </div>

          {/* Items Grid */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {flashItems.map((product, i) => {
              const salePrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group rounded-xl border border-border bg-background p-3 transition-all hover:border-gold/50 hover:shadow-md"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted/30">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                      {product.discount && (
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-bold text-destructive-foreground">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 truncate text-xs font-medium">{product.title}</h3>
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-destructive">{formatPrice(salePrice)}</span>
                    <span className="text-[10px] text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  </div>
                  <Button
                    variant="gold"
                    size="sm"
                    className="mt-2 h-7 w-full text-[11px]"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Button variant="goldOutline" asChild>
              <Link to="/products">Shop All Products <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
