import { useQuery } from '@tanstack/react-query';
import { Product } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const API_URL = 'https://fakestoreapi.com';

// Map fakestore categories to our categories
const categoryMap: Record<string, string> = {
  electronics: 'electronics',
  jewelery: 'beauty',
  "men's clothing": 'fashion',
  "women's clothing": 'fashion',
};

const badges: Array<'new' | 'hot' | 'sale'> = ['new', 'hot', 'sale'];

function enrichProduct(p: Product, i: number): Product {
  return {
    ...p,
    category: categoryMap[p.category] || p.category,
    badge: i % 4 === 0 ? badges[i % 3] : undefined,
    discount: i % 3 === 0 ? Math.floor(Math.random() * 30) + 10 : undefined,
  };
}

function mapDbProduct(row: any): Product {
  const comparePrice = row.compare_at_price ? Number(row.compare_at_price) : null;
  const price = Number(row.price);
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : undefined;

  return {
    id: row.id,
    title: row.name,
    price,
    description: row.description || '',
    category: row.category,
    image: row.image_url || '/placeholder.svg',
    rating: { rate: 4.5, count: Math.floor(Math.random() * 200) + 50 },
    badge: row.badge || undefined,
    discount,
  };
}

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // Fetch from both sources in parallel
      const [apiRes, dbRes] = await Promise.all([
        fetch(`${API_URL}/products`).then(r => r.json()).catch(() => []),
        supabase.from('products').select('*').eq('is_active', true),
      ]);

      const apiProducts: Product[] = (apiRes as Product[]).map(enrichProduct);
      const dbProducts: Product[] = (dbRes.data ?? []).map(mapDbProduct);

      return [...apiProducts, ...dbProducts];
    },
    staleTime: 1000 * 60 * 10,
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      // Try UUID format (DB product) vs numeric (API product)
      const isUuid = id.includes('-');

      if (isUuid) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return mapDbProduct(data);
      }

      const res = await fetch(`${API_URL}/products/${id}`);
      const data: Product = await res.json();
      return enrichProduct(data, Number(id));
    },
    staleTime: 1000 * 60 * 10,
  });
}
