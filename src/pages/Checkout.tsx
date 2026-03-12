import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, MapPin, Package, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/formatPrice';

const steps = [
  { id: 1, title: 'Shipping', icon: MapPin },
  { id: 2, title: 'Payment', icon: CreditCard },
  { id: 3, title: 'Review', icon: Package },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cart, cartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shipping, setShipping] = useState({
    fullName: '', address: '', city: '', state: '', zip: '', phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const tax = cartTotal * 0.08;
  const total = cartTotal + tax;

  if (!user) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-display text-3xl font-bold">Please Sign In</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to checkout.</p>
        <Button variant="gold" size="lg" className="mt-8" asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="mt-6 font-display text-3xl font-bold">Cart is Empty</h1>
        <Button variant="gold" size="lg" className="mt-8" asChild>
          <Link to="/products">Shop Now</Link>
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="nexus-container flex flex-col items-center justify-center py-32 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="flex h-24 w-24 items-center justify-center rounded-full bg-green-500/10"
        >
          <Check className="h-12 w-12 text-green-500" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 font-display text-3xl font-bold">
          Order Confirmed!
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order is being processed.
        </motion.p>
        <Button variant="gold" size="lg" className="mt-8" asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  const placeOrder = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from('orders').insert({
        user_id: user.id,
        items: cart.map(i => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity, image: i.image })) as any,
        subtotal: cartTotal,
        tax,
        total,
        shipping_address: shipping as any,
        payment_method: paymentMethod,
        status: 'pending',
      });
      if (error) throw error;
      clearCart();
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="nexus-container">
        <h1 className="font-display text-3xl font-bold">Checkout</h1>

        {/* Progress Steps */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${step >= s.id ? 'bg-gold text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                <s.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && <div className={`mx-2 h-0.5 w-8 ${step > s.id ? 'bg-gold' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="shipping" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-semibold">Shipping Information</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Label>Full Name</Label>
                      <Input value={shipping.fullName} onChange={e => setShipping(p => ({ ...p, fullName: e.target.value }))} placeholder="John Doe" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>Address</Label>
                      <Input value={shipping.address} onChange={e => setShipping(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" className="mt-1" />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input value={shipping.city} onChange={e => setShipping(p => ({ ...p, city: e.target.value }))} placeholder="Lahore" className="mt-1" />
                    </div>
                    <div>
                      <Label>State</Label>
                      <Input value={shipping.state} onChange={e => setShipping(p => ({ ...p, state: e.target.value }))} placeholder="Punjab" className="mt-1" />
                    </div>
                    <div>
                      <Label>ZIP Code</Label>
                      <Input value={shipping.zip} onChange={e => setShipping(p => ({ ...p, zip: e.target.value }))} placeholder="54000" className="mt-1" />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={shipping.phone} onChange={e => setShipping(p => ({ ...p, phone: e.target.value }))} placeholder="+92 300 1234567" className="mt-1" />
                    </div>
                  </div>
                  <Button variant="gold" className="mt-6" onClick={() => setStep(2)} disabled={!shipping.fullName || !shipping.address || !shipping.city}>
                    Continue <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-semibold">Payment Method</h2>
                  <div className="mt-4 space-y-3">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                      { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard (Demo)' },
                      { id: 'bank', label: 'Bank Transfer', desc: 'Direct bank transfer (Demo)' },
                    ].map(pm => (
                      <label key={pm.id} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors ${paymentMethod === pm.id ? 'border-gold bg-gold/5' : 'border-border hover:border-gold/50'}`}>
                        <input type="radio" name="payment" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} className="accent-[hsl(var(--gold))]" />
                        <div>
                          <p className="font-medium">{pm.label}</p>
                          <p className="text-xs text-muted-foreground">{pm.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button variant="gold" onClick={() => setStep(3)}>
                      Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-semibold">Order Review</h2>
                  <div className="mt-4 space-y-3">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="h-12 w-12 rounded-lg bg-muted object-contain p-1" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                        </div>
                        <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
                    <p><span className="text-muted-foreground">Ship to:</span> {shipping.fullName}, {shipping.address}, {shipping.city}</p>
                    <p className="mt-1"><span className="text-muted-foreground">Payment:</span> {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}</p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button variant="gold" onClick={placeOrder} disabled={loading}>
                      {loading ? 'Placing Order...' : 'Place Order'} <Check className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-semibold">Summary</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="text-gold">Free</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax (8%)</span><span>{formatPrice(tax)}</span></div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="nexus-gold-text">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
