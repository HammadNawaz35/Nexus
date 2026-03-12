import { useMemo } from 'react';
import { useAdminOrders, useAdminProducts } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function AdminAnalytics() {
  const { data: orders = [] } = useAdminOrders();
  const { data: products = [] } = useAdminProducts();

  const categoryRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      const items = Array.isArray(o.items) ? o.items as any[] : [];
      items.forEach(item => {
        const cat = item.category || 'other';
        map[cat] = (map[cat] || 0) + (Number(item.price) * (item.quantity || 1));
      });
    });
    return Object.entries(map).map(([category, revenue]) => ({ category, revenue: +revenue.toFixed(2) }));
  }, [orders]);

  const monthlyOrders = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      const month = new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      map[month] = (map[month] || 0) + 1;
    });
    return Object.entries(map).map(([month, count]) => ({ month, count }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; sold: number; revenue: number }> = {};
    orders.forEach(o => {
      const items = Array.isArray(o.items) ? o.items as any[] : [];
      items.forEach(item => {
        const key = item.title || item.name || 'Unknown';
        if (!map[key]) map[key] = { name: key, sold: 0, revenue: 0 };
        map[key].sold += item.quantity || 1;
        map[key].revenue += Number(item.price) * (item.quantity || 1);
      });
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [orders]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Revenue by Category</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Bar dataKey="revenue" fill="hsl(38,70%,50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Orders Over Time</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="count" stroke="hsl(220,60%,50%)" fill="hsl(220,60%,50%,0.15)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader><CardTitle className="text-foreground">Top Selling Products</CardTitle></CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div>
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({p.sold} sold)</span>
                  </div>
                  <span className="font-semibold text-primary">${p.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
