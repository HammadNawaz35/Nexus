import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Heart, ShoppingBag, Minus, Plus, ZoomIn } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  if (!product) return null;

  const wishlisted = isInWishlist(product.id);
  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-border bg-background shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="grid gap-0 md:grid-cols-2">
            {/* Image */}
            <div
              className="relative flex items-center justify-center bg-muted/20 p-8 cursor-zoom-in"
              onClick={() => setZoomed(!zoomed)}
            >
              {product.badge && (
                <span className={`absolute left-4 top-4 z-10 ${product.badge === 'sale' ? 'nexus-badge-sale' : product.badge === 'hot' ? 'nexus-badge-hot' : 'nexus-badge-new'}`}>
                  {product.badge === 'sale' ? `${product.discount}% OFF` : product.badge.toUpperCase()}
                </span>
              )}
              <motion.img
                src={product.image}
                alt={product.title}
                className="max-h-72 w-auto object-contain"
                animate={{ scale: zoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-muted-foreground">
                <ZoomIn className="h-4 w-4" />
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-gold">{product.category}</p>
              <h2 className="mt-1 font-display text-xl font-bold leading-tight">{product.title}</h2>

              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(product.rating.rate) ? 'fill-gold text-gold' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({product.rating.count})</span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl font-bold nexus-gold-text">{formatPrice(discountedPrice)}</span>
                {product.discount && (
                  <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
                )}
              </div>

              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

              {/* Quantity */}
              <div className="mt-5 flex items-center gap-3">
                <span className="text-sm font-medium">Qty:</span>
                <div className="flex items-center rounded-lg border border-border">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-9 w-9 items-center justify-center hover:text-gold">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="flex h-9 w-9 items-center justify-center hover:text-gold">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <Button
                  variant="gold"
                  className="flex-1"
                  onClick={() => {
                    for (let i = 0; i < qty; i++) addToCart(product);
                    onClose();
                  }}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleWishlist(product)}
                  className={wishlisted ? 'border-destructive text-destructive' : ''}
                >
                  <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} />
                </Button>
              </div>

              <Button variant="ghost" size="sm" asChild className="mt-3 w-full text-muted-foreground">
                <Link to={`/product/${product.id}`} onClick={onClose}>View Full Details →</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
