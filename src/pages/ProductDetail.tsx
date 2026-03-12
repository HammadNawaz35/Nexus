import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Share2, ArrowLeft, Minus, Plus, Truck, ShieldCheck, RotateCcw, ZoomIn } from 'lucide-react';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/ProductCard';
import ReviewsSection from '@/components/products/ReviewsSection';
import { useState } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/formatPrice';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id || '1');
  const { data: allProducts } = useProducts();
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [qty, setQty] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (isLoading || !product) {
    return (
      <div className="nexus-container py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="h-96 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="h-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  const wishlisted = isInWishlist(product.id);
  const discountedPrice = product.discount ? product.price * (1 - product.discount / 100) : product.price;
  const related = allProducts?.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4) || [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="py-12">
      <div className="nexus-container">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/products" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>
        </motion.div>

        <div className="grid gap-12 md:grid-cols-2">
          {/* Premium Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="group relative flex items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted/30 p-12 cursor-crosshair"
            onClick={() => setZoomed(!zoomed)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomed(false)}
          >
            {product.badge && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className={`absolute left-4 top-4 z-10 ${product.badge === 'sale' ? 'nexus-badge-sale' : product.badge === 'hot' ? 'nexus-badge-hot' : 'nexus-badge-new'}`}
              >
                {product.badge === 'sale' ? `${product.discount}% OFF` : product.badge.toUpperCase()}
              </motion.span>
            )}

            <motion.img
              src={product.image}
              alt={product.title}
              className="max-h-96 w-auto object-contain transition-transform"
              style={zoomed ? {
                transform: 'scale(2.5)',
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
              } : {}}
            />

            {/* Zoom indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
            >
              <ZoomIn className="h-3.5 w-3.5" /> {zoomed ? 'Click to unzoom' : 'Click to zoom'}
            </motion.div>

            {/* Decorative corners */}
            <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-gold/0 transition-colors group-hover:border-gold/30" />
            <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-gold/0 transition-colors group-hover:border-gold/30" />
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-medium uppercase tracking-wider text-gold"
              >
                {product.category}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-2 font-display text-3xl font-bold leading-tight"
              >
                {product.title}
              </motion.h1>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'fill-gold text-gold' : 'text-muted'}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.rating.count} reviews)</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex items-baseline gap-3"
            >
              <span className="text-4xl font-bold nexus-gold-text">{formatPrice(discountedPrice)}</span>
              {product.discount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.price)}</span>
                  <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-bold text-destructive">
                    Save {formatPrice(product.price - discountedPrice)}
                  </span>
                </>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="leading-relaxed text-muted-foreground"
            >
              {product.description}
            </motion.p>

            {/* Quantity & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="space-y-4 pt-2"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2 rounded-lg border border-border">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="flex h-10 w-10 items-center justify-center transition-colors hover:text-gold">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="flex h-10 w-10 items-center justify-center transition-colors hover:text-gold">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="gold"
                  size="lg"
                  className="flex-1 shadow-lg shadow-gold/20"
                  onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" /> Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => toggleWishlist(product)}
                  className={`transition-all ${wishlisted ? 'border-destructive text-destructive' : 'hover:border-gold hover:text-gold'}`}
                >
                  <Heart className="h-5 w-5" fill={wishlisted ? 'currentColor' : 'none'} />
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare} className="hover:border-gold hover:text-gold">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-2 sm:gap-4 pt-2"
            >
              {[
                { icon: Truck, text: 'Free Shipping', sub: 'Orders PKR 5000+' },
                { icon: ShieldCheck, text: 'Warranty', sub: '1 Year' },
                { icon: RotateCcw, text: '30-Day Return', sub: 'No hassle' },
              ].map((f, i) => (
                <motion.div
                  key={f.text}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-muted/30 p-2 text-center transition-colors hover:border-gold/30 sm:gap-2 sm:p-3"
                >
                  <f.icon className="h-5 w-5 text-gold" />
                  <span className="text-[10px] font-medium text-foreground sm:text-xs">{f.text}</span>
                  <span className="hidden text-[10px] text-muted-foreground sm:block">{f.sub}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewsSection productId={String(product.id)} />

        {/* Related Products */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-display text-2xl font-bold">You May Also Like</h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
