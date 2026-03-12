import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useState } from 'react';

export default function TrendingProducts() {
  const { data: products, isLoading } = useProducts();
  const [quickView, setQuickView] = useState<Product | null>(null);
  const trending = products
    ?.sort((a, b) => b.rating.rate - a.rating.rate)
    .slice(0, 4) || [];

  return (
    <section className="py-16">
      <div className="nexus-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex items-end justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
              <TrendingUp className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Trending</p>
              <h2 className="font-display text-2xl font-bold sm:text-3xl">Most Popular</h2>
            </div>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex">
            <Link to="/products">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {trending.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickView} />
            ))}
          </div>
        )}
      </div>

      {quickView && <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />}
    </section>
  );
}
