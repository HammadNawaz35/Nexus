import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/formatPrice';

interface ProductCardProps {
  product: Product;
  index?: number;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, index = 0, onQuickView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const wishlisted = isInWishlist(product.id);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative rounded-xl border border-border bg-card transition-all duration-300 hover:border-gold/30 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1"
    >
      {/* Badge */}
      {product.badge && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 + index * 0.05, type: 'spring' }}
          className={`absolute left-3 top-3 z-10 ${product.badge === 'sale' ? 'nexus-badge-sale' : product.badge === 'hot' ? 'nexus-badge-hot' : 'nexus-badge-new'}`}
        >
          {product.badge === 'sale' ? `${product.discount}% OFF` : product.badge.toUpperCase()}
        </motion.span>
      )}

      {/* Quick actions */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <button
          onClick={() => toggleWishlist(product)}
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm backdrop-blur-sm transition-all hover:scale-110 ${wishlisted ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
        >
          <Heart className="h-4 w-4" fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => onQuickView?.(product)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:scale-110 hover:text-foreground"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block overflow-hidden rounded-t-xl">
        <div className="flex h-52 items-center justify-center bg-muted/30 p-6 transition-transform duration-500 group-hover:scale-105">
          <img
            src={product.image}
            alt={product.title}
            className="h-full max-h-40 w-auto object-contain drop-shadow-md transition-all duration-500 group-hover:drop-shadow-xl"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Quick Add overlay */}
      <div className="absolute inset-x-0 bottom-[calc(100%-13rem)] flex translate-y-2 items-center justify-center opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <Button
          variant="gold"
          size="sm"
          className="h-8 shadow-lg shadow-gold/25 text-xs"
          onClick={() => addToCart(product)}
        >
          <ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Quick Add
        </Button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{product.category}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-gold">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} className={`h-3 w-3 ${i <= Math.round(product.rating.rate) ? 'fill-gold text-gold' : 'text-muted'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.rating.count})</span>
        </div>

        {/* Price & Add to cart */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <span className="text-lg font-bold nexus-gold-text">{formatPrice(discountedPrice)}</span>
            {product.discount && (
              <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full hover:bg-gold/10 hover:text-gold"
            onClick={() => addToCart(product)}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
