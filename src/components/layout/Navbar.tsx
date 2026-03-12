import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Heart, Menu, X, Sun, Moon, ChevronDown, User, Shield } from 'lucide-react';
import { useStore } from '@/contexts/StoreContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useIsAdmin } from '@/hooks/useAdmin';
import { formatPrice } from '@/lib/formatPrice';

const categories = [
  { name: 'Electronics', path: '/category/electronics' },
  { name: 'Fashion', path: '/category/fashion' },
  { name: 'Beauty', path: '/category/beauty' },
  { name: 'Home', path: '/category/home' },
  { name: 'Sports', path: '/category/sports' },
  { name: 'Gadgets', path: '/category/gadgets' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const { cartCount, cart, cartTotal } = useStore();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { data: isAdmin } = useIsAdmin();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="nexus-container">
          <div className="flex h-14 items-center justify-between gap-2 sm:h-16 sm:gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1">
              <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                <span className="nexus-gold-text">N</span>exus
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden items-center gap-6 md:flex">
              <div
                className="relative"
                onMouseEnter={() => setShowCategories(true)}
                onMouseLeave={() => setShowCategories(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  Categories <ChevronDown className="h-3.5 w-3.5" />
                </button>
                <AnimatePresence>
                  {showCategories && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 top-full mt-2 w-48 rounded-lg border border-border bg-popover p-2 shadow-xl"
                    >
                      {categories.map(cat => (
                        <Link
                          key={cat.name}
                          to={cat.path}
                          className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                          onClick={() => setShowCategories(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                All Products
              </Link>
            </div>

            {/* Search Bar Desktop */}
            <form onSubmit={handleSearch} className="hidden flex-1 md:flex max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </form>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              {/* Cart button with preview */}
              <div className="relative group">
                <Button variant="ghost" size="icon" asChild className="relative">
                  <Link to="/cart">
                    <ShoppingBag className="h-5 w-5" />
                    {cartCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-primary-foreground"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </Link>
                </Button>

                {/* Cart hover preview */}
                {cart.length > 0 && (
                  <div className="invisible absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-popover p-4 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
                    <p className="mb-2 text-xs font-semibold text-muted-foreground">{cartCount} items</p>
                    <div className="max-h-48 space-y-2 overflow-y-auto">
                      {cart.slice(0, 3).map(item => (
                        <div key={item.id} className="flex items-center gap-2">
                          <img src={item.image} alt={item.title} className="h-10 w-10 rounded object-contain bg-muted p-1" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm font-semibold">Total: <span className="nexus-gold-text">{formatPrice(cartTotal)}</span></span>
                      <Button size="sm" variant="gold" asChild>
                        <Link to="/cart">View Cart</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Button */}
              {isAdmin && (
                <Button variant="ghost" size="icon" asChild title="Admin Dashboard">
                  <Link to="/admin">
                    <Shield className="h-5 w-5 text-primary" />
                  </Link>
                </Button>
              )}

              {/* Auth Button */}
              <Button variant="ghost" size="icon" asChild>
                <Link to={user ? '/profile' : '/auth'}>
                  <User className="h-5 w-5" />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="nexus-container space-y-1 py-4">
                {categories.map(cat => (
                  <Link
                    key={cat.name}
                    to={cat.path}
                    className="block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  to="/products"
                  className="block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  onClick={() => setIsOpen(false)}
                >
                  All Products
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Search */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-border bg-background md:hidden"
          >
            <form onSubmit={handleSearch} className="nexus-container py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="h-10 w-full rounded-full border border-border bg-muted/50 pl-10 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
