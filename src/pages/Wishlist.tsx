import { motion } from 'framer-motion';
import { Heart, Trash2 } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <Heart className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-display text-3xl font-bold">Your Wishlist is Empty</h1>
        <p className="mt-2 text-muted-foreground">Save your favorite products here.</p>
        <Button variant="gold" size="lg" className="mt-8" asChild>
          <Link to="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="nexus-container">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold"
        >
          Wishlist ({wishlist.length})
        </motion.h1>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
