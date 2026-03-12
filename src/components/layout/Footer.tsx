import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

const footerLinks = {
  shop: [
    { name: 'All Products', path: '/products' },
    { name: 'Electronics', path: '/category/electronics' },
    { name: 'Fashion', path: '/category/fashion' },
    { name: 'Beauty', path: '/category/beauty' },
    { name: 'Home', path: '/category/home' },
  ],
  support: [
    { name: 'Contact Us', path: '#' },
    { name: 'FAQs', path: '#' },
    { name: 'Shipping Info', path: '#' },
    { name: 'Returns', path: '#' },
    { name: 'Track Order', path: '#' },
  ],
  company: [
    { name: 'About Nexus', path: '#' },
    { name: 'Careers', path: '#' },
    { name: 'Press', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@')) {
      toast.success('Welcome to Nexus! Check your inbox for exclusive offers.');
      setEmail('');
    } else {
      toast.error('Please enter a valid email address.');
    }
  };

  return (
    <footer className="border-t border-border bg-card">
      <div className="nexus-container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold">
                <span className="nexus-gold-text">N</span>exus
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Discover curated luxury products from world-class brands. Premium quality, exceptional service, delivered to your door.
            </p>
            <div className="mt-6 flex gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-gold hover:text-gold">
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider">{title}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-sm text-muted-foreground transition-colors hover:text-gold">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 md:p-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h3 className="font-display text-lg font-semibold">Subscribe to our Newsletter</h3>
              <p className="text-sm text-muted-foreground">Get exclusive offers, new arrivals & 10% off your first order.</p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full max-w-sm gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                />
              </div>
              <Button type="submit" variant="gold">Subscribe</Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Nexus. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Crafted with passion for luxury</p>
        </div>
      </div>
    </footer>
  );
}
