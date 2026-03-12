import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DBCategory {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  product_count: string;
  sort_order: number;
  is_active: boolean;
}

export function useCategories() {
  return useQuery<DBCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as DBCategory[];
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminCategories() {
  return useQuery<DBCategory[]>({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as DBCategory[];
    },
  });
}
