import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut, Save, MapPin, Clock, CheckCircle2, Truck, PackageCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Package, color: 'text-yellow-500' },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2, color: 'text-blue-500' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-500' },
  { key: 'delivered', label: 'Delivered', icon: PackageCheck, color: 'text-green-500' },
];

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = statusSteps.findIndex(s => s.key === status);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="flex items-center gap-1">
      {statusSteps.map((step, i) => (
        <div key={step.key} className="flex items-center">
          <div className={`flex items-center gap-1.5 ${i <= activeIdx ? '' : 'opacity-30'}`}>
            <div className={`flex h-7 w-7 items-center justify-center rounded-full ${
              i < activeIdx ? 'bg-green-500/10' : i === activeIdx ? 'bg-gold/10' : 'bg-muted'
            }`}>
              <step.icon className={`h-3.5 w-3.5 ${
                i < activeIdx ? 'text-green-500' : i === activeIdx ? 'text-gold' : 'text-muted-foreground'
              }`} />
            </div>
            <span className="hidden text-[10px] font-medium sm:inline">{step.label}</span>
          </div>
          {i < statusSteps.length - 1 && (
            <div className={`mx-1 h-0.5 w-4 rounded-full sm:w-6 ${i < activeIdx ? 'bg-green-500/40' : 'bg-muted'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({ full_name: '', phone: '', city: '', address_line1: '' });
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/auth'); return; }
    const fetchData = async () => {
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (p) setProfile({ full_name: p.full_name || '', phone: p.phone || '', city: p.city || '', address_line1: p.address_line1 || '' });
      const { data: o } = await supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (o) setOrders(o);
    };
    fetchData();
  }, [user, navigate]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from('profiles').update(profile).eq('user_id', user.id);
    if (error) toast.error('Failed to update profile');
    else toast.success('Profile updated!');
    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    toast.success('Logged out');
  };

  if (!user) return null;

  return (
    <div className="py-12">
      <div className="nexus-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold">My Account</h1>
          <p className="mt-1 text-muted-foreground">Manage your profile and track orders</p>
        </motion.div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                  <User className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Profile</h2>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-xs">Full Name</Label>
                  <Input value={profile.full_name} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">City</Label>
                  <Input value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Address</Label>
                  <Input value={profile.address_line1} onChange={e => setProfile(p => ({ ...p, address_line1: e.target.value }))} className="mt-1" />
                </div>
              </div>
              <Button variant="gold" className="mt-4" onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </motion.div>

            {/* Order Tracking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10">
                  <Package className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold">Order Tracking</h2>
                  <p className="text-xs text-muted-foreground">{orders.length} order{orders.length !== 1 && 's'}</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground/20" />
                  <p className="mt-3 text-sm text-muted-foreground">No orders yet. Start shopping!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, i) => {
                    const items = Array.isArray(order.items) ? order.items : [];
                    const isExpanded = expandedOrder === order.id;
                    return (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="rounded-xl border border-border bg-background overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                          className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-semibold nexus-gold-text">${Number(order.total).toFixed(2)}</p>
                              <OrderTimeline status={order.status} />
                            </div>
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden border-t border-border"
                            >
                              <div className="p-4 space-y-3">
                                {/* Full timeline */}
                                <div className="flex gap-3">
                                  {statusSteps.map((step, idx) => {
                                    const currentIdx = statusSteps.findIndex(s => s.key === order.status);
                                    const activeIdx = currentIdx === -1 ? 0 : currentIdx;
                                    const isCompleted = idx <= activeIdx;
                                    return (
                                      <div key={step.key} className={`flex flex-1 flex-col items-center gap-1 ${isCompleted ? '' : 'opacity-30'}`}>
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                          idx < activeIdx ? 'bg-green-500/10' : idx === activeIdx ? 'bg-gold/10' : 'bg-muted'
                                        }`}>
                                          <step.icon className={`h-5 w-5 ${
                                            idx < activeIdx ? 'text-green-500' : idx === activeIdx ? 'text-gold' : 'text-muted-foreground'
                                          }`} />
                                        </div>
                                        <span className="text-[10px] font-medium text-center">{step.label}</span>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Order items */}
                                {items.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Items</p>
                                    {items.map((item: any, j: number) => (
                                      <div key={j} className="flex items-center gap-3 rounded-lg bg-muted/30 p-2">
                                        {item.image && (
                                          <img src={item.image} alt={item.title} className="h-10 w-10 rounded object-contain bg-background p-1" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="truncate text-xs font-medium">{item.title || 'Product'}</p>
                                          <p className="text-[10px] text-muted-foreground">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <span className="text-xs font-medium">${Number(item.price || 0).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Shipping address */}
                                {order.shipping_address && (
                                  <div className="flex items-start gap-2 rounded-lg bg-muted/30 p-3">
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                                    <div className="text-xs text-muted-foreground">
                                      <p className="font-medium text-foreground">Shipping Address</p>
                                      <p>{(order.shipping_address as any).address || 'N/A'}, {(order.shipping_address as any).city || ''}</p>
                                    </div>
                                  </div>
                                )}

                                {/* Order summary */}
                                <div className="flex justify-between text-xs border-t border-border pt-2">
                                  <span className="text-muted-foreground">Subtotal: ${Number(order.subtotal).toFixed(2)}</span>
                                  <span className="text-muted-foreground">Tax: ${Number(order.tax).toFixed(2)}</span>
                                  <span className="font-semibold">Total: <span className="nexus-gold-text">${Number(order.total).toFixed(2)}</span></span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10">
                <User className="h-10 w-10 text-gold" />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{profile.full_name || 'Nexus Member'}</h3>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              <p className="mt-2 text-xs text-muted-foreground">Member since {new Date(user.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sign Out
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
