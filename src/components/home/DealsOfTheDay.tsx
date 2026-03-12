import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';
import { useStore } from '@/contexts/StoreContext';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/formatPrice';

export default function DealsOfTheDay() {
  const { data: products } = useProducts();
  const { addToCart } = useStore();

  // Pick 3 products with highest discounts
  const deals = products
    ?.filter(p => p.discount && p.discount > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0))
    .slice(0, 3) || [];

  if (deals.length === 0) return null;

  return (
    <section className="py-16">
      <div className="nexus-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Limited Time</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Deals of the Day</h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {deals.map((product, i) => {
            const salePrice = product.price * (1 - (product.discount || 0) / 100);
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card"
              >
                {/* Discount Badge */}
                <div className="absolute left-4 top-4 z-10 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                  -{product.discount}% OFF
                </div>

                {/* Image */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="flex h-56 items-center justify-center bg-muted/20 p-8 transition-transform duration-500 group-hover:scale-105">
                    <img src={product.image} alt={product.title} className="h-full max-h-44 w-auto object-contain" loading="lazy" />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug transition-colors hover:text-gold">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="mt-2 flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span className="text-xs font-medium">{product.rating.rate}</span>
                    <span className="text-xs text-muted-foreground">({product.rating.count} reviews)</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold nexus-gold-text">{formatPrice(salePrice)}</span>
                      <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                    </div>
                    <Button variant="gold" size="sm" onClick={() => addToCart(product)} className="group/btn">
                      <ShoppingBag className="mr-1 h-4 w-4" /> Add
                    </Button>
                  </div>

                  {/* Savings highlight */}
                  <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-1.5 text-center text-xs font-semibold text-green-600 dark:text-green-400">
                    You save {formatPrice(product.price - salePrice)} on this deal!
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="goldOutline" asChild>
            <Link to="/products">View All Deals <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
