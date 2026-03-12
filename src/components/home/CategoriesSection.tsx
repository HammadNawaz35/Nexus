import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

// Fallback images for categories without uploaded images
import catElectronics from '@/assets/cat-electronics.jpg';
import catFashion from '@/assets/cat-fashion.jpg';
import catBeauty from '@/assets/cat-beauty.jpg';
import catHome from '@/assets/cat-home.jpg';
import catSports from '@/assets/cat-sports.jpg';
import catGadgets from '@/assets/cat-gadgets.jpg';

const fallbackImages: Record<string, string> = {
  electronics: catElectronics,
  fashion: catFashion,
  beauty: catBeauty,
  home: catHome,
  sports: catSports,
  gadgets: catGadgets,
};

export default function CategoriesSection() {
  const { data: categories = [], isLoading } = useCategories();

  return (
    <section className="py-16">
      <div className="nexus-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">Browse</p>
          <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Shop by Category</h2>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat, i) => {
              const image = cat.image_url || fallbackImages[cat.slug] || catElectronics;
              return (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group relative block overflow-hidden rounded-xl aspect-[3/4]"
                  >
                    <img
                      src={image}
                      alt={cat.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-colors group-hover:from-black/90" />
                    <div className="relative flex h-full flex-col justify-end p-4">
                      <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                      <p className="mt-0.5 text-xs text-white/70">{cat.product_count}</p>
                      <div className="mt-2 h-0.5 w-0 bg-gold transition-all duration-300 group-hover:w-full" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
