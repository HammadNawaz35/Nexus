import { Package, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminOrders, useAdminProducts } from '@/hooks/useAdmin';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { useMemo } from 'react';

const COLORS = ['hsl(38,70%,50%)', 'hsl(220,60%,50%)', 'hsl(150,60%,40%)', 'hsl(0,70%,50%)', 'hsl(280,60%,50%)'];

export default function AdminDashboard() {
  const { data: orders = [] } = useAdminOrders();
  const { data: products = [] } = useAdminProducts();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
    const avgOrder = orders.length ? totalRevenue / orders.length : 0;
    return { totalRevenue, avgOrder, orderCount: orders.length, productCount: products.length };
  }, [orders, products]);

  const revenueByDay = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => {
      const day = new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      map[day] = (map[day] || 0) + Number(o.total);
    });
    return Object.entries(map).slice(-7).map(([name, revenue]) => ({ name, revenue: +revenue.toFixed(2) }));
  }, [orders]);

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach(o => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const statCards = [
    { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500' },
    { title: 'Orders', value: stats.orderCount, icon: ShoppingCart, color: 'text-blue-500' },
    { title: 'Products', value: stats.productCount, icon: Package, color: 'text-primary' },
    { title: 'Avg. Order', value: `$${stats.avgOrder.toFixed(2)}`, icon: TrendingUp, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(s => (
          <Card key={s.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Revenue (Last 7 Days)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Line type="monotone" dataKey="revenue" stroke="hsl(38,70%,50%)" strokeWidth={2} dot={{ fill: 'hsl(38,70%,50%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-foreground">Orders by Status</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ordersByStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
