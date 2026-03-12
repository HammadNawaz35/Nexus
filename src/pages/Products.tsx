import { useState, useMemo, forwardRef } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import QuickViewModal from '@/components/products/QuickViewModal';
import { SlidersHorizontal, X, Star, Grid3X3, LayoutList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Best Deals', value: 'discount' },
];

const ratingFilters = [4, 3, 2, 1];

const ProductsPage = forwardRef<HTMLDivElement>(function ProductsPage(_props, ref) {
  const [searchParams] = useSearchParams();
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = categorySlug || '';

  const { data: products, isLoading } = useProducts();
  const [sort, setSort] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState('');

  // Extract available categories from products
  const availableCategories = useMemo(() => {
    if (!products) return [];
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    // URL search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    // Local search
    if (localSearch) {
      const q = localSearch.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }

    // Category from URL
    if (categoryParam) {
      result = result.filter(p => p.category.toLowerCase() === categoryParam.toLowerCase());
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      result = result.filter(p => p.rating.rate >= minRating);
    }

    // Discount filter
    if (onlyDiscounted) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    // Sort
    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating.rate - a.rating.rate); break;
      case 'discount': result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
    }

    return result;
  }, [products, searchQuery, localSearch, categoryParam, sort, priceRange, selectedCategories, minRating, onlyDiscounted]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 5000]);
    setMinRating(0);
    setOnlyDiscounted(false);
    setLocalSearch('');
  };

  const activeFilterCount = selectedCategories.length + (minRating > 0 ? 1 : 0) + (onlyDiscounted ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0);

  const title = categoryParam
    ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
    : searchQuery
      ? `Results for "${searchQuery}"`
      : 'All Products';

  return (
    <div ref={ref} className="py-12">
      <div className="nexus-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{filtered.length} products found</p>
        </motion.div>

        {/* Toolbar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'gold' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            {/* Inline search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Filter results..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-3 text-xs outline-none transition-all focus:w-64 focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="hidden items-center rounded-lg border border-border sm:flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-gold/10 text-gold' : 'text-muted-foreground'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex h-8 w-8 items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-gold/10 text-gold' : 'text-muted-foreground'}`}
              >
                <LayoutList className="h-4 w-4" />
              </button>
            </div>

            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-gold"
            >
              {sortOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">Filters</h3>
                  <div className="flex items-center gap-2">
                    {activeFilterCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs text-muted-foreground">
                        Clear all
                      </Button>
                    )}
                    <button onClick={() => setShowFilters(false)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Categories */}
                  {!categoryParam && (
                    <div>
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</h4>
                      <div className="space-y-1.5">
                        {availableCategories.map(cat => (
                          <label key={cat} className="flex cursor-pointer items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => toggleCategory(cat)}
                              className="h-3.5 w-3.5 rounded border-border accent-gold"
                            />
                            <span className="text-sm capitalize">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price Range</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium nexus-gold-text">PKR {priceRange[0]}</span>
                        <span className="text-muted-foreground">–</span>
                        <span className="font-medium nexus-gold-text">PKR {priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={2500}
                        value={priceRange[0]}
                        onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full accent-[hsl(var(--gold))]"
                      />
                      <input
                        type="range"
                        min={0}
                        max={5000}
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full accent-[hsl(var(--gold))]"
                      />
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Min Rating</h4>
                    <div className="space-y-1.5">
                      {ratingFilters.map(r => (
                        <label key={r} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="rating"
                            checked={minRating === r}
                            onChange={() => setMinRating(minRating === r ? 0 : r)}
                            className="h-3.5 w-3.5 accent-gold"
                          />
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < r ? 'fill-gold text-gold' : 'text-muted'}`} />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">& up</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Special Filters */}
                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Special</h4>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onlyDiscounted}
                        onChange={() => setOnlyDiscounted(!onlyDiscounted)}
                        className="h-3.5 w-3.5 rounded border-border accent-gold"
                      />
                      <span className="text-sm">On Sale Only</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter tags */}
        {activeFilterCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <motion.button
                key={cat}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => toggleCategory(cat)}
                className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium capitalize text-foreground"
              >
                {cat} <X className="h-3 w-3" />
              </motion.button>
            ))}
            {minRating > 0 && (
              <button onClick={() => setMinRating(0)} className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium">
                {minRating}★+ <X className="h-3 w-3" />
              </button>
            )}
            {onlyDiscounted && (
              <button onClick={() => setOnlyDiscounted(false)} className="flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs font-medium">
                On Sale <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}

        {/* Products */}
        {isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-20 text-center">
            <p className="text-lg text-muted-foreground">No products found</p>
            {activeFilterCount > 0 && (
              <Button variant="goldOutline" size="sm" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </motion.div>
        ) : (
          <div className={`mt-8 grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </div>
  );
});

export default ProductsPage;
