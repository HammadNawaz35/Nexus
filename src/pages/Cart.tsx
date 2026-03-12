import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/formatPrice';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useStore();

  if (cart.length === 0) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-display text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add some premium products to get started.</p>
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
          Shopping Cart ({cartCount})
        </motion.h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <Link to={`/product/${item.id}`} className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-muted/30 p-2">
                  <img src={item.image} alt={item.title} className="h-full w-auto object-contain" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link to={`/product/${item.id}`} className="text-sm font-medium hover:text-gold">{item.title}</Link>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-lg border border-border">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center hover:text-gold">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center hover:text-gold">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold nexus-gold-text">{formatPrice(item.price * item.quantity)}</span>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground transition-colors hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <Button variant="ghost" size="sm" onClick={clearCart} className="text-muted-foreground">
              Clear Cart
            </Button>
          </div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-fit rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-xl font-semibold">Order Summary</h2>
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-gold">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>{formatPrice(cartTotal * 0.08)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-xl nexus-gold-text">{formatPrice(cartTotal * 1.08)}</span>
                </div>
              </div>
            </div>
            <Button variant="gold" size="lg" className="mt-6 w-full" asChild>
              <Link to="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="mt-2 w-full" asChild>
              <Link to="/products">Continue Shopping</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
